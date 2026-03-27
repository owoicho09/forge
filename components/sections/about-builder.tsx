'use client'

import { motion } from 'framer-motion'
import { WHATSAPP_URL, BUILDER_BIO } from '@/lib/constants'

export function AboutBuilder() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <h2 className="font-syne font-bold text-3xl sm:text-4xl text-[#1a1714] mb-6">About the Builder</h2>
            <p className="text-slate-600 text-base leading-relaxed">{BUILDER_BIO}</p>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-50px' }}
            className="flex flex-col items-center sm:items-start gap-6"
          >
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Get in Touch</p>
              <p className="text-sm text-slate-600">Have a question? Reach out on WhatsApp.</p>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#25d366] text-white font-semibold rounded-lg hover:bg-[#20ba58] transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>💬</span>
              Message on WhatsApp
            </motion.a>

            <p className="text-xs text-slate-500">Direct, fast response guaranteed</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
