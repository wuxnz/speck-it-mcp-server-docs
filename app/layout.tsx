import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Speck-It MCP Server Documentation',
    template: '%s | Speck-It MCP Server',
  },
  description:
    'Comprehensive documentation for the Speck-It MCP Server. Learn how to install, configure, and use Speck-It for intelligent project management and automated task generation.',
  keywords: [
    'Speck-It',
    'MCP Server',
    'Model Context Protocol',
    'Project Management',
    'Task Automation',
    'Documentation',
    'AI Development',
    'Software Development',
    'Automated Planning',
  ],
  authors: [{ name: 'Speck-It Team' }],
  creator: 'Speck-It',
  publisher: 'Speck-It',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://speck-it.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://speck-it.dev',
    title: 'Speck-It MCP Server Documentation',
    description:
      'Comprehensive documentation for the Speck-It MCP Server. Learn how to install, configure, and use Speck-It for intelligent project management.',
    siteName: 'Speck-It MCP Server Documentation',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Speck-It MCP Server Documentation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speck-It MCP Server Documentation',
    description:
      'Comprehensive documentation for the Speck-It MCP Server. Learn how to install, configure, and use Speck-It for intelligent project management.',
    images: ['/og-image.png'],
    creator: '@speckit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
