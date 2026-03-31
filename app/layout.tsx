import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Syne, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _syne = Syne({ subsets: ["latin"], variable: '--font-syne', weight: ['400', '500', '600', '700', '800'] });
const _dmSans = DM_Sans({ subsets: ["latin"], variable: '--font-dm-sans', weight: ['300', '400', '500', '700'] });

export const metadata: Metadata = {
  title: 'FORGE - Build. Buy. Deploy.',
  description: 'Premium AI tools, custom builds, and innovative ideas. Discover production-ready solutions and custom builds crafted by a passionate Python and AI developer.',
  generator: 'v0.app',
  metadataBase: new URL('https://forge.example.com'),
  openGraph: {
    title: 'FORGE - Build. Buy. Deploy.',
    description: 'Premium AI tools, custom builds, and innovative ideas for developers.',
    type: 'website',
  },
  
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0e0c' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ '--font-syne': _syne.style.fontFamily, '--font-dm-sans': _dmSans.style.fontFamily } as React.CSSProperties}>
      <body className="font-dm-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
