'use client'

import { motion } from 'framer-motion'

const features = [
  {
    emoji: '🛒',
    name: 'Ready to Buy',
    description: 'Production-ready solutions available for immediate purchase and deployment.',
  },
  {
    emoji: '🔧',
    name: 'Custom Builds',
    description: 'Tailored solutions built specifically for your unique requirements and scale.',
  },
  {
    emoji: '💡',
    name: 'Ideas for Sale',
    description: 'Innovative concepts and early-stage projects with revenue potential.',
  },
]

export function WhatYouGet() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-12"
        >
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-[#1a1714] mb-4">What You Get</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            FORGE offers three distinct categories of solutions tailored to your needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="p-8 border-t-4 border-t-[#e85d26] rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-5xl mb-4">{feature.emoji}</div>
              <h3 className="font-syne font-bold text-xl text-[#1a1714] mb-2">{feature.name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
