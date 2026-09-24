import { Suspense } from 'react'
import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { BRAND_NAME } from '@/lib/constants'
import { ScrollToRegisterButton } from '@/components/workshops/scroll-to-register-button'
import { AiAutomationRegistrationForm } from '@/components/workshops/ai-automation-registration-form'
import { WORKSHOP_TITLE, WORKSHOP_WHEN } from '@/lib/workshops/ai-automation'

export function AiAutomationWorkshopContent() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 py-3">
        <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
          <Link href="/" className="font-syne text-base font-bold tracking-tight text-[#1a1714]">
            {BRAND_NAME}
            <span className="text-[#e85d26]">.</span>
          </Link>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="px-4 pt-8 pb-10 sm:px-6 sm:pt-14 sm:pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#e85d26] sm:text-xs">
            Free workshop · For business owners
          </p>
          <h1 className="mt-3 text-balance font-dm-sans text-[1.75rem] font-bold leading-[1.2] tracking-normal text-[#1a1714] sm:text-4xl md:text-5xl">
            {WORKSHOP_TITLE}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-balance text-sm leading-relaxed text-slate-600 sm:mt-4 sm:max-w-2xl sm:text-lg">
            Learn which parts of your business can be automated, where AI fits, and how these systems actually
            work.
          </p>

          <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a1714] sm:text-base">
            <CalendarDays className="h-4 w-4 text-[#e85d26]" aria-hidden="true" />
            Join us {WORKSHOP_WHEN}
          </p>

          <div className="mt-6 sm:mt-8">
            <ScrollToRegisterButton className="inline-flex w-full items-center justify-center rounded-lg bg-[#e85d26] px-6 py-3.5 text-sm font-bold tracking-tight text-white shadow-md shadow-[#e85d26]/20 transition-all hover:opacity-90 active:scale-[0.99] sm:w-auto sm:px-8 sm:py-4 sm:text-base">
              Reserve My Free Spot
            </ScrollToRegisterButton>
            <p className="mt-3 text-xs text-slate-500 sm:text-sm">Free to attend.</p>
          </div>
        </div>
      </section>

      {/* Section 2: Registration / pre-qualification */}
      <section id="register" className="scroll-mt-6 bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-syne text-lg font-bold text-[#1a1714] sm:text-2xl">Reserve your free spot</h2>
            <p className="mx-auto mt-2 max-w-md text-balance text-sm leading-relaxed text-slate-600">
              A few quick questions so we can tailor the examples to the businesses in the room.
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            <Suspense fallback={null}>
              <AiAutomationRegistrationForm />
            </Suspense>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-700 bg-[#1a1714] py-10 text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <Link href="/" className="font-syne text-lg font-bold tracking-tight">
            {BRAND_NAME}
            <span className="text-[#e85d26]">.</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <Link href="/terms" className="transition-colors hover:text-[#e85d26]">
              Terms &amp; Conditions
            </Link>
            <span aria-hidden="true">&middot;</span>
            <Link href="/privacy" className="transition-colors hover:text-[#e85d26]">
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
