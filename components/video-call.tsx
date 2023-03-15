import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

export default function VideoCall() {
  const [callFrame, setCallFrame] = useState<DailyCall | null>(null);
  const callFrameRef = useRef<DailyCall | null>(null);
  const roomUrl = process.env.NEXT_PUBLIC_ROOM_URL;
  useEffect(() => {
    if (!callFrameRef.current) {
      const newCallFrame = DailyIframe.createFrame({
        showLeaveButton: true,
        iframeStyle: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        },
      });
      setCallFrame(newCallFrame);
      callFrameRef.current = newCallFrame;
    }
  }, []);

  useEffect(() => {
    if (callFrame) {
      callFrame.join({ url: roomUrl });
      // Recording events logging recording-started and recording stopped
      callFrame
        .on('recording-started', (event) => {
          console.log('started recording', event);
        })
        .on('recording-stopped', async (event) => {
          console.log('stopped recording', event);
          const generateSummaryResponse = await axios.post(
            `/api/generate-summary`
          );
          const email = generateSummaryResponse.data;
          console.log('email', email);
        });
    }
    return () => {
      callFrame?.destroy();
      console.log('callFrame destroyed');
    };
  }, [callFrame, roomUrl]);

  return (
    <>
      <Head>
        <title>Video Call</title>
      </Head>
    </>
  );
}
