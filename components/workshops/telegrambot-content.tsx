import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bot, Rocket, Wrench } from 'lucide-react'
import { BRAND_NAME } from '@/lib/constants'
import { ScrollToRegisterButton } from '@/components/workshops/scroll-to-register-button'
import { RegistrationForm } from '@/components/workshops/registration-form'

const exploreCards = [
  {
    icon: Wrench,
    label: 'BUILD',
    description: 'Learn how to create your own Telegram bot with the help of AI.',
  },
  {
    icon: Bot,
    label: 'AUTOMATE',
    description: 'Explore how your bot can help you search for job opportunities and receive relevant matches.',
  },
  {
    icon: Rocket,
    label: 'LAUNCH & MONETIZE',
    description: 'Discover how to think beyond building and explore how useful digital solutions can create opportunities.',
  },
]

function ChatMockVisual() {
  return (
    <div className="mx-auto mt-8 w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-[#e7ebf0] shadow-sm" aria-hidden="true">
      <div className="flex items-center gap-2 bg-[#0088cc] px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Job Finder Bot</p>
          <p className="text-xs text-white/70">online</p>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm text-[#1a1714] shadow-sm">
          Tell me your skills and I&apos;ll find matching roles for you.
        </div>
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#effdde] px-3.5 py-2.5 text-sm text-[#1a1714] shadow-sm">
          I&apos;m a frontend developer, open to remote roles.
        </div>
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm">
          <p className="text-sm font-semibold text-[#1a1714]">Frontend Developer &middot; Remote</p>
          <p className="mt-0.5 text-xs text-slate-500">Example match &middot; illustrative only</p>
        </div>
      </div>
    </div>
  )
}

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
      <section className="px-4 pt-10 pb-14 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e85d26]">Free AI Workshop</p>
          <h1 className="mt-3 text-balance font-syne text-3xl font-extrabold leading-tight tracking-tight text-[#1a1714] sm:text-4xl md:text-5xl">
            Build your own Telegram bot that finds jobs for you.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-relaxed text-slate-600 sm:text-lg">
            Join us to build your personal Telegram bot and explore how AI can help you discover job opportunities
            that match your skills and interests.
          </p>

          <div className="mt-8">
            <ScrollToRegisterButton className="inline-flex w-full items-center justify-center rounded-lg bg-[#e85d26] px-8 py-4 text-base font-bold tracking-tight text-white shadow-md shadow-[#e85d26]/20 transition-all hover:opacity-90 active:scale-[0.99] sm:w-auto">
              Join the free workshop
            </ScrollToRegisterButton>
            <p className="mt-3 text-sm text-slate-500">
              Free to attend. Register to get access to the WhatsApp community.
            </p>
          </div>

          <ChatMockVisual />
        </div>
      </section>

      {/* What you'll explore */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-syne text-xl font-bold text-[#1a1714] sm:text-2xl">What you&apos;ll explore</h2>

          <div className="mt-3 text-center sm:hidden">
            <p className="text-xs font-medium text-slate-400">Swipe to see more &rarr;</p>
          </div>

          <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:mt-8 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {exploreCards.map((card) => (
              <div
                key={card.label}
                className="min-w-[78%] shrink-0 snap-start rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:min-w-[45%] md:min-w-0"
              >
                <card.icon size={20} strokeWidth={1.75} className="text-[#e85d26]" />
                <p className="mt-3 font-syne text-sm font-bold tracking-wide text-[#1a1714]">{card.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Michael */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center font-syne text-xl font-bold text-[#1a1714] sm:text-2xl">
            Build with Michael from {BRAND_NAME}
          </h2>

          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:w-48">
              <Image
                src="/workshops/telegrambot/michael.jpg"
                alt="Michael, ForgeBuilds"
                fill
                sizes="192px"
                className="object-cover"
                priority={false}
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-base leading-relaxed text-slate-600">
                I&apos;m Michael, a Python and AI developer building software, automation systems, and AI-powered
                products.
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Through {BRAND_NAME}, I explore how AI can help turn ideas into useful digital solutions. In this
                workshop, I&apos;ll walk you through building your own Telegram bot and exploring how it can help
                with your job search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="scroll-mt-6 bg-slate-50 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-syne text-xl font-bold text-[#1a1714] sm:text-2xl">Get your free workshop access</h2>
            <p className="mx-auto mt-2 max-w-md text-balance text-sm leading-relaxed text-slate-600 sm:text-base">
              Register below and get the WhatsApp community invite so you can receive workshop updates and joining
              instructions.
            </p>
          </div>

          <div className="mt-8">
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
