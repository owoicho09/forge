import type { Metadata } from 'next'
import { TelegramBotWorkshopContent } from '@/components/workshops/telegrambot-content'

const title = 'Free Workshop: Build a Telegram Job-Finder Bot — FORGE'
const description =
  'Join a free workshop to build your own Telegram bot that helps you find job opportunities matching your skills. Register to get WhatsApp community access.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/workshops/telegrambot',
  },
  openGraph: {
    title,
    description,
    url: '/workshops/telegrambot',
    siteName: 'FORGE',
    type: 'website',
    images: [
      {
        url: '/icon.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/icon.jpg'],
  },
}

export default function TelegramBotWorkshopPage() {
  return <TelegramBotWorkshopContent />
}
