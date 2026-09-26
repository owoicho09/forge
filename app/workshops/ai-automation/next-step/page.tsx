import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND_NAME } from '@/lib/constants'
import { AiAutomationQualificationSurvey } from '@/components/workshops/ai-automation-qualification-survey'
import { QUALIFICATION_PATH } from '@/lib/workshops/ai-automation-qualification'

export const metadata: Metadata = {
  title: 'Find Your Next Step — FORGE',
  description: 'Let’s figure out what you want to build or implement next.',
  alternates: { canonical: QUALIFICATION_PATH },
  robots: { index: false, follow: false },
}

export default function AiAutomationNextStepPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <nav className="border-b border-slate-200 py-3">
        <div className="mx-auto flex max-w-xl items-center px-4 sm:px-6">
          <Link href="/" className="font-syne text-base font-bold tracking-tight text-[#1a1714]">
            {BRAND_NAME}
            <span className="text-[#e85d26]">.</span>
          </Link>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-6 sm:px-6 sm:pt-10 sm:pb-14">
        <h1 className="font-dm-sans text-2xl font-bold text-[#1a1714] sm:text-3xl">Find Your Next Step</h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Let’s figure out what you want to build or implement next.
        </p>

        <div className="mt-8 flex flex-1 flex-col">
          <AiAutomationQualificationSurvey />
        </div>
      </main>
    </div>
  )
}
