import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data';
import { Readable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import nodemailer from 'nodemailer';

// Import environment variables
const {
  DAILY_API_KEY,
  NEXT_PUBLIC_ROOM_URL,
  OPENAI_API_KEY,
  EMAIL_SUMMARY,
  SMTP_LOGIN,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_SERVER,
} = process.env;

// Function to retrieve the recording Link
async function getRecordingLink(): Promise<string> {
  try {
    const roomName = getRoomName(NEXT_PUBLIC_ROOM_URL);

    const dailyRecordingsURL = `https://api.daily.co/v1/recordings`;

    // Get the last recording in for the given Daily room
    const recordingUrl = `${dailyRecordingsURL}?room_name=${roomName}&limit=1`;
    const authConfig = {
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    };
    const recordingsResponse = await axios.get(recordingUrl, authConfig);

    // Retrieving recording data
    const recordingsData = recordingsResponse?.data;
    const recordings = recordingsData?.data;

    // Check if recordings was retrieved successfully
    if (!recordings || recordings.length === 0) {
      throw new Error('Could not fetch access link');
    }
    const firstRecording = recordings[0];
    const recordingId = firstRecording.id;

    // Get the Daily recording access link
    const accessLinkURL = `${dailyRecordingsURL}/${recordingId}/access-link`;
    const accessLinkResponse = await axios.get(accessLinkURL, authConfig);
    // Check if access link was retrieved successfully
    if (!accessLinkResponse.data || !accessLinkResponse.data.download_link) {
      throw new Error('Could not fetch access link');
    }
    // Extract the download link from the response data
    const recordingLink = accessLinkResponse.data.download_link;
    return recordingLink;
    // Handle any errors that occur during the process
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error while getting recording link: ${error.message}`);
    }
    throw new Error('Internal Server Error');
  }
}

// Function to transcribe the recording
async function transcribeAudio(recordingLink: string): Promise<any> {
  try {
    const audioData = await axios
      .get(recordingLink, { responseType: 'arraybuffer' })
      .then((recordingRes) => recordingRes.data);

    // Compress audio and remove video
    const audioBitrate = '64k';

    const audioStream = Readable.from(audioData);
    const ffmpegStream = ffmpeg(audioStream)
      .noVideo()
      .audioBitrate(audioBitrate)
      .audioCodec('libmp3lame')
      .format('mp3')
      .pipe();

    // Create the form data and send to Open AI
    const formData = new FormData();
    formData.append('file', ffmpegStream, { filename: 'audio.mp3' });
    formData.append('model', 'whisper-1');

    const result = await axios
      .post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
          ...formData.getHeaders(),
        },
      })
      .then((transcriptionRes) => transcriptionRes.data);

    return { transcription: result };
    // Handle any errors that occur during the process
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof AxiosError && error.response) {
      const errorResponse = error.response.data;
      const statusCode = error.response.status || 500;
      const statusText = error.response.statusText || 'Internal Server Error';
      const errorMessage =
        errorResponse?.error.message ||
        `Error ${statusCode} ${statusText}: An error occurred while transcribing the call`;
      throw new Error(errorMessage);
    }
    throw new Error('Internal Server Error');
  }
}

// Function to summarize the transcription
async function summarizeTranscript(transcription: string): Promise<any> {
  try {
    const summaryResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Summarize the following text. Provide a short summary of the meeting and a bulleted list of the main meeting highlights : ${transcription}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Destructure the summary from the response
    const {
      message: { content: summary },
    } = summaryResponse.data.choices[0];
    return { summary };

    // Handle errors in the process
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const errorResponse = error.response.data;
      const statusCode = error.response.status || 500;
      const statusText = error.response.statusText || 'Internal Server Error';
      const errorMessage =
        errorResponse?.error.message ||
        `Error ${statusCode} ${statusText}: An error occurred while generating the summary`;
      throw new Error(errorMessage);
    }
    throw new Error('Internal Server Error');
  }
}

// Function to email the summary
async function emailSummary(summary: string): Promise<any> {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: SMTP_SERVER,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_LOGIN,
        pass: SMTP_PASSWORD,
      },
    } as nodemailer.TransportOptions);

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Daily Meeting Summary" <${SMTP_LOGIN}>`,
      to: EMAIL_SUMMARY,
      subject: 'Meeting Summary from your Daily Video Call',
      text: `This is an automated meeting summary from your Daily video call: ${summary}`,
    });

    return info;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error && error.message
        ? { errorMessage: error.message }
        : { errorMessage: 'An error occurred while generating the email' };

    throw new Error(JSON.stringify(errorMessage));
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const recordingLink = await getRecordingLink();

    // Transcribe the recording
    const transcriptResponse = await transcribeAudio(recordingLink);
    const {
      transcription: { text: transcription },
    } = transcriptResponse;

    // Summarize the transcript
    const summaryResponse = await summarizeTranscript(transcription);
    const { summary } = summaryResponse;

    // Send the email
    let emailResponse = {};
    if (
      EMAIL_SUMMARY &&
      SMTP_LOGIN &&
      SMTP_PASSWORD &&
      SMTP_PORT &&
      SMTP_SERVER
    ) {
      emailResponse = await emailSummary(summary);
    }

    // Return the result to the client
    res.status(200).json({ summary, emailResponse });
  } catch (error: unknown) {
    console.error(error);
    let errorMessage: string;
    if (error instanceof AxiosError) {
      errorMessage =
        error.response?.data?.errorMessage ||
        error.message ||
        'An error occurred while generating the summary';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'Internal Server Error';
    }
    res.status(500).json({ errorMessage });
  }
}

function getRoomName(roomURL?: string): string {
  if (!roomURL) {
    throw new Error('roomURL is undefined');
  }
  const parts = roomURL.split('/');
  return parts[parts.length - 1];
}
