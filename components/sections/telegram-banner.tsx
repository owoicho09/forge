'use client'

import { motion } from 'framer-motion'
import { TELEGRAM_URL } from '@/lib/constants'

export function TelegramBanner() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-[#1a1714] to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-white mb-4">Stay Updated</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join our Telegram community to get early access to new products, exclusive deals, and builder updates.
          </p>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#0088cc] text-white font-semibold text-lg rounded-lg hover:bg-[#0077b5] transition-colors shadow-lg hover:shadow-xl"
          >
            <span></span>
            Join Telegram Channel
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
