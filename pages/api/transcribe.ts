import axios from 'axios';
import FormData from 'form-data';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { recordingLink } = req.body;
    const audioData = await axios
      .get(recordingLink, { responseType: 'arraybuffer' })
      .then((recordingRes) => recordingRes.data);
    const audioBuffer = Buffer.from(audioData);
    const formData = new FormData();
    formData.append('file', audioBuffer, { filename: 'audio.mp4' });
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
    res.status(200).json({ transcription: result });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send('An error occurred while processing the transcription.');
  }
}
