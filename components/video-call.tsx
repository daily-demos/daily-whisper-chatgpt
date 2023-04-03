import axios, { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import NotificationBar from './notification';

export default function VideoCall() {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>(
    'success'
  );
  const [callFrame, setCallFrame] = useState<DailyCall | null>(null);
  const callFrameRef = useRef<DailyCall | null>(null);
  const roomUrl = process.env.NEXT_PUBLIC_ROOM_URL;
  useEffect(() => {
    if (!callFrameRef.current) {
      const newCallFrame = DailyIframe.createFrame({
        showLeaveButton: true,
        iframeStyle: {
          top: '0',
          left: '0',
          width: '100VW',
          height: '100VH',
          border: 'none',
        },
      });
      setCallFrame(newCallFrame);
      callFrameRef.current = newCallFrame;
    }
  }, []);

  useEffect(() => {
    if (callFrame) {
      callFrame.join({ url: roomUrl });
      // Begin transcribing and generating a summary when recording is stopped
      callFrame.on('recording-stopped', async () => {
        try {
          setNotificationMessage(
            'Transcribing and generating meeting summary. Please leave app running.'
          );
          const generateSummaryResponse = await axios.post(
            `/api/generate-summary`
          );

          // Destructure the summary and email responses
          const { summary } = generateSummaryResponse.data;
          const { emailResponse } = generateSummaryResponse.data;

          // Send appropriate notifications and console the summary.
          console.log('Call Summary', summary);
          if (Object.keys(emailResponse).length > 0) {
            setNotificationMessage(`Meeting summary has been emailed`);
          } else if (summary) {
            setNotificationMessage(
              `Meeting summary has been generated check the browser console`
            );
          }
        } catch (error: unknown) {
          let errorText: string;
          if (error instanceof AxiosError) {
            errorText =
              error.response?.data?.errorMessage ||
              'An error occurred while generating the summary';
            setNotificationMessage(errorText);
            setNotificationType('error');
          } else {
            errorText = (error as Error).message;
            setNotificationMessage(errorText);
            setNotificationType('error');
          }
        }
      });
    }
    return () => {
      callFrame?.destroy();
    };
  }, [callFrame, roomUrl]);

  return (
    <>
      <Head>
        <title>Video Call</title>
      </Head>
      <NotificationBar message={notificationMessage} type={notificationType} />
    </>
  );
}
