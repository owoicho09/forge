import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { BRAND_NAME } from '@/lib/constants'
import { Reveal } from '@/components/newsletter/reveal'

export const metadata: Metadata = {
  title: 'Book a Call — Forge AI Hiring Agent',
  description:
    'See your AI hiring agent live and get it running in your agency. Book a free 30-minute discovery call.',
}

const CALENDAR_URL = 'https://calendly.com/michaelogaje033/30min'

export default function RecruitmentAgenciesPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-sm text-center">
        <Reveal delay={0} className="mb-8 flex justify-center">
          <span className="font-syne text-base font-bold tracking-tight text-foreground">
            {BRAND_NAME}
            <span className="text-accent">.</span>
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h1
            className="text-balance text-2xl font-bold leading-snug tracking-normal text-foreground sm:text-3xl sm:leading-tight"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Let&apos;s get your AI hiring agent running.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-4 max-w-xs text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Book a free 30-minute call and we&apos;ll set it up for your agency.
          </p>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-7 py-4 text-base font-bold tracking-tight text-accent-foreground shadow-md shadow-accent/15 transition-all hover:opacity-90 active:scale-[0.99]"
            >
              Book Your Free Call
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="text-xs text-muted-foreground">No obligation &middot; 30 minutes</p>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
