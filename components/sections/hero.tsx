'use client'

import { motion } from 'framer-motion'
import { TELEGRAM_URL, WHATSAPP_URL, BRAND_TAGLINE } from '@/lib/constants'
import { useEffect, useState } from 'react'

const textCycle = ['AI Agents.', 'Bots.', 'Web Apps.', 'Ideas.']

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
          linear-gradient(to bottom, #ffffff, #fafaf9)
        `,
      }}
    >
      {/* Content */}
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
          <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">Now Open</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-syne font-bold text-4xl sm:text-5xl lg:text-6xl text-[#1a1714] mb-6 leading-tight"
        >
          Build. <span className="text-[#e85d26]">Buy.</span> Deploy.
        </motion.h1>

        {/* Cycling Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-12 sm:h-14 mb-8 flex items-center justify-center"
        >
          <motion.p
            key={cycleIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="font-syne font-bold text-2xl sm:text-3xl text-[#e85d26]"
          >
            {textCycle[cycleIndex]}
          </motion.p>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Discover premium AI tools, custom builds, and innovative ideas. Every product is crafted with precision,
          designed for developers, and ready to scale.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('store')}
            className="px-8 py-3 bg-[#1a1714] text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Browse Store
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border-2 border-[#1a1714] text-[#1a1714] font-medium rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            Join Telegram <span>→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
