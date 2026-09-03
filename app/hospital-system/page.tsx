import type { Metadata } from 'next'
import { HospitalSystemContent } from '@/components/hospital/hospital-system-content'

const title = 'Hospital Management System — FORGE'
const description =
  'A hospital management system for private hospitals and clinics in Nigeria. Registration, nursing, doctors, laboratory and pharmacy in one patient record. Message us on WhatsApp to see it live.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/hospital-system',
  },
  openGraph: {
    title,
    description,
    url: '/hospital-system',
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

export default function HospitalSystemPage() {
  return <HospitalSystemContent />
}
