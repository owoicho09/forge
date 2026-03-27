'use client'

import { motion } from 'framer-motion'
import { WHATSAPP_URL } from '@/lib/constants'

export function FloatingWhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25d366] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-2xl"
      style={{
        boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)',
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-[#25d366] opacity-0"
      />
      <span className="relative">💬</span>
    </motion.a>
  )
}
