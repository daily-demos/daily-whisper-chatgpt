import { Inter } from 'next/font/google';
import VideoCall from '../components/video-call';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div>
      <VideoCall />
    </div>
  );
}
