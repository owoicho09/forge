import { Navigation } from '@/components/sections/navigation'
import { Hero } from '@/components/sections/hero'
import { WhatYouGet } from '@/components/sections/what-you-get'
import { FeaturedDrop } from '@/components/sections/featured-drop'
import { TheStore } from '@/components/sections/the-store'
import { HowItWorks } from '@/components/sections/how-it-works'
import { AboutBuilder } from '@/components/sections/about-builder'
import { TelegramBanner } from '@/components/sections/telegram-banner'
import { Footer } from '@/components/sections/footer'
import { FloatingWhatsAppButton } from '@/components/floating-whatsapp-button'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <WhatYouGet />
      <FeaturedDrop />
      <TheStore />
      <HowItWorks />
      <AboutBuilder />
      <TelegramBanner />
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  )
}
