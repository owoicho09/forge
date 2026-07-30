import type { ReactNode } from 'react'
import { Navigation } from '@/components/sections/navigation'
import { Footer } from '@/components/sections/footer'

export function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string
  effectiveDate: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-36 lg:px-8">
        <h1 className="font-syne text-3xl font-bold text-[#1a1714] sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">Effective date: {effectiveDate}</p>

        <div
          className="
            mt-10 space-y-10
            [&_h2]:font-syne [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#1a1714] [&_h2]:mb-3
            [&_p]:text-slate-600 [&_p]:leading-relaxed [&_p+p]:mt-3
            [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5
            [&_li]:text-slate-600 [&_li]:leading-relaxed
            [&_strong]:text-[#1a1714] [&_strong]:font-semibold
            [&_a]:text-[#e85d26] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80
          "
        >
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
