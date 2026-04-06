'use client'

import { motion } from 'framer-motion'
import { TELEGRAM_URL, WHATSAPP_URL, BRAND_TAGLINE } from '@/lib/constants'
import { useEffect, useState } from 'react'

const textCycle = ['AI Agents.', 'Bots.', 'Web Apps.', 'Automation.', 'Ideas.']

export function Hero() {
  const [cycleIndex, setCycleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % textCycle.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 80% 0%, rgba(232, 93, 38, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 20% 100%, rgba(232, 93, 38, 0.04) 0%, transparent 50%),
          linear-gradient(to bottom, #ffffff, #fafaf9)
        `,
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#e85d26]"
          />
          <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">
            Now taking orders
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-syne font-extrabold text-4xl sm:text-5xl lg:text-7xl text-[#1a1714] mb-4 leading-none tracking-tight"
        >
          Tell me what you need.<br />
          <span className="text-[#e85d26] italic">I'll build it.</span>
        </motion.h1>

        {/* Cycling Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-10 sm:h-12 mb-6 flex items-center justify-center"
        >
          <motion.p
            key={cycleIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="font-syne font-bold text-xl sm:text-2xl text-slate-400"
          >
            {textCycle[cycleIndex]}
          </motion.p>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-light"
        >
          Forge is a catalog of AI tools, automation systems, custom software builds,
          and ideas worth executing. Browse what's available or place a custom order.
        </motion.p>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: '#e85d26' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollToSection('store')}
            className="px-10 py-4 bg-[#1a1714] text-white font-semibold rounded-lg transition-colors text-sm tracking-wide uppercase"
          >
            Browse the Store
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 border-2 border-slate-200 text-slate-600 font-medium rounded-lg hover:border-slate-400 transition-colors inline-flex items-center justify-center gap-2 text-sm tracking-wide uppercase"
          >
            Custom Order →
          </motion.a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 uppercase tracking-widest"
        >
          <span>AI Agents</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>Telegram Bots</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>Web Apps</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>Automation</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>Custom Builds</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>Ideas for Sale</span>
        </motion.div>

      </div>
    </section>
  )
}