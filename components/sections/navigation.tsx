'use client'

import { TELEGRAM_URL, BRAND_NAME } from '@/lib/constants'
import { motion } from 'framer-motion'

export function Navigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/80 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 font-syne font-bold text-xl text-[#1a1714]"
          >
            {BRAND_NAME}
            <span className="text-[#e85d26]">.</span>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('store')}
              className="text-sm font-medium text-slate-600 hover:text-[#e85d26] transition-colors"
            >
              Store
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-medium text-slate-600 hover:text-[#e85d26] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-slate-600 hover:text-[#e85d26] transition-colors"
            >
              About
            </button>
          </div>

          {/* CTA Button */}

        </div>
      </div>
    </motion.nav>
  )
}
