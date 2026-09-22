import { Suspense } from 'react'
import Link from 'next/link'
import { Bot, Rocket, Wrench } from 'lucide-react'
import { BRAND_NAME } from '@/lib/constants'
import { ScrollToRegisterButton } from '@/components/workshops/scroll-to-register-button'
import { RegistrationForm } from '@/components/workshops/registration-form'

const exploreCards = [
  {
    icon: Wrench,
    label: 'BUILD',
    description: 'Create your own Telegram bot with AI.',
  },
  {
    icon: Bot,
    label: 'AUTOMATE',
    description: 'Explore how your bot can find and match job opportunities to your preferences.',
  },
  {
    icon: Rocket,
    label: 'LAUNCH & MONETIZE',
    description: 'Discover how useful digital solutions can become real products and services.',
  },
]

export function TelegramBotWorkshopContent() {
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

      {/* Hero */}
      <section className="px-4 pt-8 pb-10 sm:px-6 sm:pt-14 sm:pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#e85d26] sm:text-xs">Free AI Workshop</p>
          <h1 className="mt-3 text-balance font-syne text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-[#1a1714] sm:text-4xl md:text-5xl">
            Build your own Telegram bot that finds jobs for you.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-balance text-sm leading-relaxed text-slate-600 sm:mt-4 sm:max-w-xl sm:text-lg">
            Create a personal job-finding bot and explore how AI can help you discover relevant opportunities.
          </p>

          <div className="mt-6 sm:mt-8">
            <ScrollToRegisterButton className="inline-flex w-full items-center justify-center rounded-lg bg-[#e85d26] px-6 py-3.5 text-sm font-bold tracking-tight text-white shadow-md shadow-[#e85d26]/20 transition-all hover:opacity-90 active:scale-[0.99] sm:w-auto sm:px-8 sm:py-4 sm:text-base">
              Join the free workshop
            </ScrollToRegisterButton>
            <p className="mt-3 text-xs text-slate-500 sm:text-sm">
              Free to attend. Register below to join the WhatsApp community.
            </p>
          </div>
        </div>
      </section>

      {/* What you'll explore */}
      <section className="bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-syne text-lg font-bold text-[#1a1714] sm:text-2xl">What you&apos;ll explore</h2>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
            {exploreCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <card.icon size={18} strokeWidth={1.75} className="text-[#e85d26]" />
                <p className="mt-2 font-syne text-xs font-bold tracking-wide text-[#1a1714] sm:text-sm">{card.label}</p>
                <p className="mt-1 text-sm leading-snug text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="scroll-mt-6 bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-syne text-lg font-bold text-[#1a1714] sm:text-2xl">Get your free workshop access</h2>
            <p className="mx-auto mt-2 max-w-md text-balance text-sm leading-relaxed text-slate-600">
              Register below and get the WhatsApp community invite so you can receive workshop updates and joining
              instructions.
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            <Suspense fallback={null}>
              <RegistrationForm />
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
          <p className="text-sm text-slate-400">Part of {BRAND_NAME} &mdash; Build. Buy. Deploy.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <Link href="/" className="transition-colors hover:text-[#e85d26]">
              {BRAND_NAME} Home
            </Link>
            <span aria-hidden="true">&middot;</span>
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
