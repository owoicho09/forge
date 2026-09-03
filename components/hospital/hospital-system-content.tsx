import Link from 'next/link'
import {
  ClipboardList,
  HeartPulse,
  Stethoscope,
  FlaskConical,
  Pill,
  ArrowRight,
  Check,
  ShieldCheck,
} from 'lucide-react'
import { BRAND_NAME, WHATSAPP_URL } from '@/lib/constants'

const whatsappMessage = encodeURIComponent(
  "Saw the hospital system. I'd like to talk about building something similar for ..."
)
const HOSPITAL_WHATSAPP_URL = `${WHATSAPP_URL}?text=${whatsappMessage}`

const departments = [
  {
    icon: ClipboardList,
    name: 'Records / Front desk',
    description: 'Registers the patient, issues the hospital number, opens the visit. Sends them to nursing.',
  },
  {
    icon: HeartPulse,
    name: 'Nursing',
    description: 'Records vitals and the presenting complaint against the visit. Sends the patient to a clinician.',
  },
  {
    icon: Stethoscope,
    name: 'Clinician',
    description: 'Opens the file with the history already summarised. Examines, records the diagnosis, requests tests, prescribes.',
  },
  {
    icon: FlaskConical,
    name: 'Laboratory',
    description: "Receives the request instantly with the clinician's note attached. Enters results, sends them back.",
  },
  {
    icon: Pill,
    name: 'Pharmacy',
    description: 'Receives the prescription before the patient arrives. Dispenses and records it.',
  },
]

const capabilities = [
  'One permanent record per patient — every visit, vital sign, result and prescription, findable by name, phone or hospital number',
  "Requests reach other departments instantly, with the sender's note attached",
  'Each department gets its own workspace and its own queue',
  'Departments configured by the hospital, not fixed in code',
  "AI summarises a patient's history so a clinician reads years of record in seconds",
  'Patient contact by WhatsApp and email, logged to the record',
  'Built-in recruitment — post a vacancy, AI-screened applications, shortlist, hire',
]

function WhatsAppButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      href={HOSPITAL_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#25d366] px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-[#20ba58] hover:shadow-lg active:scale-[0.98] ${className}`}
    >
      <span>💬</span>
      {children}
    </a>
  )
}

export function HospitalSystemContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav — slim, links back to the main Forge site */}
      <nav className="border-b border-slate-200 py-3">
        <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
          <Link href="/" className="font-syne text-base font-bold tracking-tight text-[#1a1714]">
            {BRAND_NAME}
            <span className="text-[#e85d26]">.</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="animate-fade-up px-4 pt-8 pb-12 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-syne text-3xl font-extrabold leading-tight tracking-tight text-[#1a1714] sm:text-4xl">
            Hospital management system.
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-balance text-base leading-relaxed text-slate-600 sm:text-lg">
            Registration, nursing, doctors, laboratory and pharmacy — one patient record across every department.
          </p>

          {/* Video */}
          <div className="relative mx-auto mt-8 aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/hospital/demo-poster.jpg"
              className="absolute inset-0 h-full w-full"
            >
              <source src="/hospital/demo.mp4" type="video/mp4" />
            </video>
          </div>

          {/* CTA 1 */}
          <div className="mt-6">
            <WhatsAppButton className="w-full sm:w-auto">Message on WhatsApp</WhatsAppButton>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-syne text-xl font-bold text-[#1a1714] sm:text-2xl">How it works</h2>

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
            {departments.map((dept, i) => (
              <div key={dept.name} className="flex items-center gap-2 md:flex-1">
                <div className="flex flex-1 flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <dept.icon size={16} strokeWidth={1.75} className="shrink-0 text-[#e85d26]" />
                    <p className="font-syne text-sm font-bold text-[#1a1714]">{dept.name}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{dept.description}</p>
                </div>
                {i < departments.length - 1 && (
                  <ArrowRight size={16} className="hidden shrink-0 text-slate-300 md:block" />
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 border-t border-slate-200 pt-6 text-center text-sm font-medium italic text-[#1a1714]">
            Everything each department does writes to the same patient record.
          </p>
        </div>
      </section>

      {/* What it does — dark panel, matches the "Product of the week" register */}
      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-[#0f1923] p-7 sm:p-9">
            <h2 className="font-syne text-xl font-extrabold text-white sm:text-2xl">What it does</h2>
            <ul className="mt-6 space-y-3.5">
              {capabilities.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                  <Check size={14} className="mt-0.5 shrink-0 text-[#e85d26]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The honest note */}
      <section className="px-4 pb-14 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <p>
            Everything in the demo above uses simulated patient data. The system doesn&apos;t diagnose, prescribe
            independently, or predict disease — every clinical decision is made by a person.
          </p>
        </div>
      </section>

      {/* Close */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-medium text-[#1a1714] sm:text-lg">
            Built for private hospitals and clinics in Nigeria. Configured to your departments and workflow.
          </p>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">Message to discuss what it would take for yours.</p>
          <div className="mt-5">
            <WhatsAppButton className="w-full sm:w-auto">Message on WhatsApp</WhatsAppButton>
          </div>
        </div>
      </section>

      {/* Footer — links back to the main Forge site */}
      <footer className="border-t border-slate-700 bg-[#1a1714] py-10 text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <Link href="/" className="font-syne text-lg font-bold tracking-tight">
            {BRAND_NAME}
            <span className="text-[#e85d26]">.</span>
          </Link>
          <p className="text-sm text-slate-400">Part of Forge — Build. Buy. Deploy.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <Link href="/" className="transition-colors hover:text-[#e85d26]">
              Forge Home
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
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
