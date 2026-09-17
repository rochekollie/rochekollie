import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Roche Kollie - Fullstack Web Developer',
  description: 'Full-stack web developer specializing in building scalable web applications.',
  authors: [ {name: 'Roche Kollie', url: 'https://rochekollie.com'} ],
  keywords: [
    'Roche Kollie',
    'Full-stack web developer',
    'Frontend Engineer',
    'Momentum',
    'React',
    'Next.js',
    'TypeScript',
  ],
  icons: {
    icon: '/assets/images/profiles/rochekollie.jpeg',
    shortcut: '/assets/images/profiles/rochekollie.jpeg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
