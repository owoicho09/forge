'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ClipboardList,
  HeartPulse,
  Stethoscope,
  FlaskConical,
  Pill,
  Check,
  ShieldCheck,
} from 'lucide-react'
import { BRAND_NAME, WHATSAPP_URL } from '@/lib/constants'

const whatsappMessage = encodeURIComponent(
  "Saw the hospital system. I'd like to talk about building something similar for —"
)
const HOSPITAL_WHATSAPP_URL = `${WHATSAPP_URL}?text=${whatsappMessage}`

const flow = [
  { icon: ClipboardList, label: 'Front desk', detail: 'registers the patient' },
  { icon: HeartPulse, label: 'Nursing', detail: 'records vitals' },
  { icon: Stethoscope, label: 'Clinician', detail: 'opens the file — history already summarised' },
  { icon: FlaskConical, label: 'Laboratory', detail: 'gets the request instantly, sends results back' },
  { icon: Pill, label: 'Pharmacy', detail: 'has the prescription before the patient reaches the counter' },
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
    <motion.a
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      href={HOSPITAL_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#25d366] px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-[#20ba58] hover:shadow-lg ${className}`}
    >
      <span>💬</span>
      {children}
    </motion.a>
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
      <section className="px-4 pt-8 pb-12 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-syne text-3xl font-extrabold leading-tight tracking-tight text-[#1a1714] sm:text-4xl"
          >
            A hospital management system.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-xl text-balance text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            Registration, nursing, doctors, laboratory and pharmacy — one patient record, from the front desk to the counter.
          </motion.p>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto mt-8 aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm"
          >
            <video
              controls
              playsInline
              preload="metadata"
              poster="/hospital/demo-poster.jpg"
              className="absolute inset-0 h-full w-full"
            >
              <source src="/hospital/demo.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* CTA 1 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <WhatsAppButton className="w-full sm:w-auto">Message on WhatsApp</WhatsAppButton>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-50px' }}
            className="font-syne text-xl font-bold text-[#1a1714] sm:text-2xl"
          >
            How it works
          </motion.h2>

          <div className="mt-8 space-y-0">
            {flow.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true, margin: '-50px' }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#e85d26] shadow-sm ring-1 ring-slate-200">
                    <step.icon size={18} strokeWidth={1.75} />
                  </div>
                  {i < flow.length - 1 && <div className="my-1 h-8 w-px flex-1 bg-slate-300" />}
                </div>
                <div className="pb-6 pt-2">
                  <p className="text-sm leading-relaxed text-slate-700">
                    <span className="font-semibold text-[#1a1714]">{step.label}</span> {step.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What it does — dark panel, matches the "Product of the week" register */}
      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-50px' }}
            className="rounded-2xl bg-[#0f1923] p-7 sm:p-9"
          >
            <h2 className="font-syne text-xl font-extrabold text-white sm:text-2xl">What it does</h2>
            <ul className="mt-6 space-y-3.5">
              {capabilities.map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 text-sm leading-relaxed text-slate-300"
                >
                  <Check size={14} className="mt-0.5 shrink-0 text-[#e85d26]" />
                  <span>{line}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* The honest note */}
      <section className="px-4 pb-14 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-2xl items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500 sm:text-sm"
        >
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <p>
            Everything in the demo above uses simulated patient data. The system doesn&apos;t diagnose, prescribe
            independently, or predict disease — every clinical decision is made by a person.
          </p>
        </motion.div>
      </section>

      {/* Close */}
      <section className="px-4 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-base font-medium text-[#1a1714] sm:text-lg">
            Built for private hospitals and clinics in Nigeria.
          </p>
          <div className="mt-5">
            <WhatsAppButton className="w-full sm:w-auto">Message on WhatsApp</WhatsAppButton>
          </div>
        </motion.div>
      </section>

      {/* Footer — links back to the main Forge site */}
      <footer className="border-t border-slate-700 bg-[#1a1714] py-10 text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <Link href="/" className="font-syne text-lg font-bold tracking-tight">
            {BRAND_NAME}
            <span className="text-[#e85d26]">.</span>
          </Link>
          <p className="text-sm text-slate-400">Part of Forge — Build. Buy. Deploy.</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <Link href="/" className="transition-colors hover:text-[#e85d26]">
              Forge Home
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#e85d26]">
              Terms &amp; Conditions
            </Link>
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
