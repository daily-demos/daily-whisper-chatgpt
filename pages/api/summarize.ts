import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 try {
  const { transcription } = req.body;
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
       model: 'gpt-3.5-turbo',
       messages: [{"role": "user", "content":`Summarize the following text: ${transcription.text}`}],
     },
     {
       headers: {
         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
         'Content-Type': 'application/json',
       },
     }
   );
 
   const summary = response.data.choices[0].message.content;
   console.log('this is the summary', summary)
   res.status(200).json({ summary });
 }

 catch (error) {
  console.error(error);
  res.status(500).send('An error occurred while processing the summary.');
}
}
