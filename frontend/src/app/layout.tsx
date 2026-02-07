
import type { Metadata } from 'next';
import './globals.css';
import InteractiveBackground from '@/components/ui/InteractiveBackground';
import BackgroundWrapper from '@/components/ui/BackgroundWrapper';
import DashboardModal from '@/components/DashboardModal';

export const metadata: Metadata = {
  title: 'Kuan-Hao | Software Engineer',
  description: 'Personal portfolio and blog of Kuan-Hao.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="noise-overlay" />
        <InteractiveBackground />
        <BackgroundWrapper>{children}</BackgroundWrapper>
        <DashboardModal />
      </body>
    </html>
  );
}
