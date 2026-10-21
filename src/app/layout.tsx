import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NEWSIGHT | Professional Digital News & Video Journalism',
    template: '%s | NEWSIGHT',
  },
  description: 'Independent digital news and video journalism platform. Live broadcasts, in-depth ground reports, documentary investigations, and verified news coverage.',
  metadataBase: new URL('https://newsight.media'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NEWSIGHT',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#080B11',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased dark`}
    >
      <body className="min-h-screen bg-[#080B11] text-[#F5F7FA] font-sans selection:bg-[#E50914] selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
