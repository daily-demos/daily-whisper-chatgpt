import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const serverUrl = process.env.SERVER_URL;

    // Call the recording API
    const recordingResponse = await axios.post(`${serverUrl}/api/recording`);
    const recordingLink = recordingResponse.data.data[0].download_link;

    // Call the transcription API
    const transcriptResponse = await axios.post(`${serverUrl}/api/transcribe`, {
      recordingLink,
    });
    const { transcription } = transcriptResponse.data;

    // Call the summarize API
    const summaryResponse = await axios.post(`${serverUrl}/api/summarize`, {
      transcription,
    });
    const { summary } = summaryResponse.data;

    // Call the email API
    const emailResponse = await axios.post(`${serverUrl}/api/email`, {
      summary,
    });
    const emailResult = emailResponse.data;

    // Return the result to the client
    res.status(200).json(emailResult);
  } catch (error: unknown) {
    let errorMessage: string;
    if (error instanceof AxiosError) {
      errorMessage =
        error.response?.data?.errorMessage ||
        error.message ||
        'An error occurred while generating the summary';
    } else {
      errorMessage = (error as Error).message;
    }
    res.status(500).json({ errorMessage });
  }
}
