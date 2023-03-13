import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
 try {
 const API_KEY = process.env.DAILY_API_KEY;
 const roomName = process.env.ROOM_NAME;
 const recordingUrl = `https://api.daily.co/v1/recordings?room_name=${roomName}&limit=1`;
const response = await axios.get(recordingUrl, {
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});
if (!response.data || !response.data.data || response.data.data.length === 0) {
 return res.status(500).send('Could not fetch access link');
}
const recordingId = response.data.data[0].id;
const accessLinkResponse = await axios.get(`https://api.daily.co/v1/recordings/${recordingId}/access-link`, {
 headers: {
   Authorization: `Bearer ${API_KEY}`,
 },
});
if (!accessLinkResponse.data || !accessLinkResponse.data.download_link) {
 return res.status(500).json({ error: 'Could not fetch access link' });
}
const recordingLink = accessLinkResponse.data.download_link;
console.log("Recording link", recordingLink);
const data = {
 total_count: response.data.total_count,
 data: [{
   ...response.data.data[0],
   download_link: recordingLink
 }]
};
return res.status(200).json(data);
} catch (error) {
    console.error(error);
    return res.status(500).send('Could not fetch recording');
  }
}