import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { env } = process;
    const API_KEY = env.DAILY_API_KEY;
    const roomName = getRoomName(env.NEXT_PUBLIC_ROOM_URL);

    const dailyRecordingsURL = `https://api.daily.co/v1/recordings`;

    // Get the last recording in for the given Daily room
    const recordingUrl = `${dailyRecordingsURL}?room_name=${roomName}&limit=1`;
    const authConfig = {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    };
    const recordingsResponse = await axios.get(recordingUrl, authConfig);

    // Retrieving recording data and adding some  error handling
    const recordingsData = recordingsResponse?.data;
    const recordings = recordingsData?.data;
    if (!recordings || recordings.length === 0) {
      return res.status(500).send('Could not fetch access link');
    }
    const firstRecording = recordings[0];
    const recordingId = firstRecording.id;

    // Get the Daily recording access link
    const accessLinkURL = `${dailyRecordingsURL}/${recordingId}/access-link`;
    const accessLinkResponse = await axios.get(accessLinkURL, authConfig);
    if (!accessLinkResponse.data || !accessLinkResponse.data.download_link) {
      return res.status(500).json({ error: 'Could not fetch access link' });
    }

    const recordingLink = accessLinkResponse.data.download_link;

    // Return the recording data plus the fetched recording access link
    const recordingsDataWithLink = {
      total_count: recordingsData.total_count,
      data: [
        {
          ...firstRecording,
          download_link: recordingLink,
        },
      ],
    };
    return res.status(200).json(recordingsDataWithLink);
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

function getRoomName(roomURL?: string): string {
  if (!roomURL) {
    throw new Error('roomURL is undefined');
  }
  const parts = roomURL.split('/');
  return parts[parts.length - 1];
}
