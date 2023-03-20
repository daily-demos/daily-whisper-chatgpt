import axios, { AxiosError } from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import { promises as fs } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import ffmpeg from 'fluent-ffmpeg';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { recordingLink } = req.body;
    const audioData = await axios
      .get(recordingLink, { responseType: 'arraybuffer' })
      .then((recordingRes) => recordingRes.data);

    // Compress audio and remove video
    const outputFilePath = 'audio_compressed.mp3';
    const audioBitrate = '64k';

    await new Promise<void>((resolve, reject) => {
      const audioStream = Readable.from(audioData);
      ffmpeg(audioStream)
        .noVideo()
        .audioBitrate(audioBitrate)
        .audioCodec('libmp3lame')
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          console.error('Error extracting and re-encoding audio:', error);
          reject(error);
        })
        .save(outputFilePath);
    });

    const compressedAudioData = await fs.readFile(outputFilePath);

    const formData = new FormData();
    formData.append('file', compressedAudioData, { filename: 'audio.mp3' });
    formData.append('model', 'whisper-1');

    const result = await axios
      .post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
          ...formData.getHeaders(),
        },
      })
      .then((transcriptionRes) => transcriptionRes.data);

    return res.status(200).json({ transcription: result });
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const errorResponse = error.response.data;
      const statusCode = error.response.status || 500;
      const statusText = error.response.statusText || 'Internal Server Error';
      const errorMessage =
        errorResponse?.error.message ||
        `Error ${statusCode} ${statusText}: An error occurred while transcribing the call`;
      return res.status(statusCode).json({ errorMessage });
    }
    return res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
