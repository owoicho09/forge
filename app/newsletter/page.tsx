import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight, ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRAND_NAME } from '@/lib/constants'
import { Reveal } from '@/components/newsletter/reveal'

export const metadata: Metadata = {
  title: 'Free Newsletter Audit',
  description:
    'Find out how much revenue is leaking out of your newsletter before it ever reaches a call. Free audit.',
}

const CTA_LABEL = 'Book Your Free Audit'
const CALENDAR_URL = process.env.NEWSLETTER_CALENDAR_URL || '#'

const SCREENSHOT_PATH = path.join(process.cwd(), 'public', 'newsletter', 'spam-screenshot.png')
const SCREENSHOT_SRC = '/newsletter/spam-screenshot.png'

function CTAButton({ className, intro }: { className?: string; intro?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {intro && (
        <p className="mx-auto max-w-xs text-balance text-sm leading-relaxed text-muted-foreground sm:max-w-sm sm:text-base">
          {intro}
        </p>
      )}
      <div className="flex flex-col items-center gap-2.5">
        <a
          href={CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-7 py-4 text-base font-bold tracking-tight text-accent-foreground shadow-md shadow-accent/15 transition-all hover:opacity-90 active:scale-[0.99] sm:w-auto sm:min-w-[320px]"
        >
          {CTA_LABEL}
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-xs text-muted-foreground">Free audit &middot; 15 minutes</p>
      </div>
    </div>
  )
}

function ScreenshotProof() {
  const hasScreenshot = fs.existsSync(SCREENSHOT_PATH)

  return (
    <div className="mx-auto w-full max-w-[380px]">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        My spam folder &mdash; today
      </p>
      {hasScreenshot ? (
        <div className="overflow-hidden rounded-2xl border border-border shadow-lg shadow-black/5 ring-1 ring-black/[0.02]">
          <Image
            src={SCREENSHOT_SRC}
            alt="Screenshot of real newsletters, including a major creator's, sitting in a spam folder"
            width={720}
            height={1400}
            sizes="(min-width: 640px) 380px, 90vw"
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      ) : (
        <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted px-6 text-center">
          <ImageOff className="h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Add spam-screenshot.png to /public/newsletter/
          </p>
        </div>
      )}
    </div>
  )
}

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-xl px-5 py-14 sm:max-w-2xl sm:py-24">
        <Reveal delay={0} className="mb-10 flex justify-center sm:mb-12">
          <span className="font-syne text-lg font-bold tracking-tight text-foreground">
            {BRAND_NAME}
            <span className="text-accent">.</span>
          </span>
        </Reveal>

        {/* Hook */}
        <Reveal delay={0.08}>
          <section className="text-center">
            <h1
              className="mx-auto max-w-xs text-balance text-2xl font-bold leading-snug tracking-normal text-foreground sm:max-w-none sm:text-4xl sm:leading-tight"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Are you making enough from your newsletter?
            </h1>
          </section>
        </Reveal>

        {/* The uncomfortable math */}
        <Reveal delay={0.16}>
          <section className="mx-auto mt-6 max-w-md space-y-4 text-center sm:mt-8">
            <p className="text-balance text-base leading-relaxed sm:text-lg">
              You send 2,000 newsletters. You book 10 qualified calls. That feels like a good
              week.
            </p>
            <p className="text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              But what about the other 1,990 who got the email and did nothing?
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.24}>
          <CTAButton
            className="mt-10 sm:mt-12"
            intro="In 15 minutes I'll show you where your list is leaking money — and what it's worth to fix it."
          />
        </Reveal>

        <hr className="my-14 border-border sm:my-20" />

        {/* The spam reveal */}
        <section className="mx-auto max-w-md space-y-4 text-center">
          <p className="text-balance text-base leading-relaxed sm:text-lg">
            As basic as it sounds, the first thing that matters is whether your emails even land.
          </p>
          <p className="text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            I found Grant Cardone sitting in my spam folder &mdash; a newsletter that size,
            filtered out before it ever reached the inbox.
          </p>
        </section>

        <div className="mx-auto mt-8 sm:mt-10">
          <ScreenshotProof />
        </div>

        <section className="mx-auto mt-8 max-w-md text-center sm:mt-10">
          <p className="text-balance text-base font-medium leading-relaxed sm:text-lg">
            Go check your own spam folder. If a newsletter you actually subscribe to is sitting
            in there, the same thing is happening to your list.
          </p>
        </section>

        <hr className="my-14 border-border sm:my-20" />

        {/* Credibility + final CTA */}
        <section className="mx-auto max-w-md space-y-4 text-center">
          <p className="text-balance text-lg font-semibold leading-snug sm:text-xl">
            We build newsletter systems that generate revenue on autopilot.
          </p>
          <p className="text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Escaping the spam folder is just one phase of increasing your revenue.
          </p>
          <p className="text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Book a call for a free audit and consultation.
          </p>
        </section>

        <CTAButton className="mt-8 sm:mt-10" />

        <p className="mt-16 text-center font-syne text-sm font-semibold tracking-wide text-muted-foreground sm:mt-20">
          {BRAND_NAME}
          <span className="text-accent">.</span>
        </p>
      </div>
    </main>
  )
}
