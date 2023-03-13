import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) 
{ try {
const serverUrl = process.env.SERVER_URL;
console.log('SERVER_URL', serverUrl,process.env.NEXT_PUBLIC_ROOM_URL);

 // Call the recording API
 const recordingResponse = await axios.post(serverUrl + '/api/recording');
 const recordingLink = recordingResponse.data.data[0].download_link;
 console.log("the recordingLink", recordingLink); 

 //Call the transcription API
 const transcriptResponse = await axios.post(serverUrl + '/api/transcribe', { recordingLink });
 const transcription = transcriptResponse.data.transcription;
 console.log('transcription', transcription)

// Call the summarize API endpoint with the transcription
const summaryResponse = await axios.post(serverUrl + '/api/summarize', { transcription });
const summary = summaryResponse.data.summary;
console.log('summary', summary);

// Call the email API endpoint with the summary
const emailResponse = await axios.post(serverUrl + '/api/email', { summary });
const emailResult = emailResponse.data;

// Return the result to the client
res.status(200).json(emailResult);

} 
 catch (error) {
  console.error(error);

  const errorResponse = {
    error: 'An error occurred while generating the summary',
  };

  res.status(500).json(errorResponse);
}
}