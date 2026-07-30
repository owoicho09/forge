'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BRAND_NAME, TELEGRAM_URL, WHATSAPP_URL } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1a1714] text-white py-12 sm:py-16 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-700">
          {/* Left - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="flex items-center gap-1 font-syne font-bold text-2xl mb-2">
              {BRAND_NAME}
              <span className="text-[#e85d26]">.</span>
            </div>
            <p className="text-slate-400 text-sm">Premium AI tools and custom builds.</p>
          </motion.div>

          {/* Right - Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: '-50px' }}
            className="flex flex-col sm:items-end gap-4"
          >
            <div className="flex gap-6 flex-wrap">
              <a href="#store" className="text-slate-300 hover:text-[#e85d26] transition-colors text-sm">
                Store
              </a>
              <a href="#how-it-works" className="text-slate-300 hover:text-[#e85d26] transition-colors text-sm">
                How It Works
              </a>
              <a href="#about" className="text-slate-300 hover:text-[#e85d26] transition-colors text-sm">
                Contact
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#0088cc] transition-colors text-sm"
              >
                Telegram
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom - Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col items-center gap-3 text-center text-slate-400 text-xs"
        >
          <p>&copy; {currentYear} {BRAND_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-[#e85d26] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-[#e85d26] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
