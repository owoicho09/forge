import type { Metadata } from 'next'
import { AiAutomationWorkshopContent } from '@/components/workshops/ai-automation-content'
import { WORKSHOP_PATH } from '@/lib/workshops/ai-automation'

const title = 'Free Workshop: AI Automation for Business — FORGE'
const description =
  'A free workshop for business owners: what you can automate with AI, where it fits in your business, how automation systems work, plus a live practical demo.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: WORKSHOP_PATH,
  },
  openGraph: {
    title,
    description,
    url: WORKSHOP_PATH,
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

export default function AiAutomationWorkshopPage() {
  return <AiAutomationWorkshopContent />
}
