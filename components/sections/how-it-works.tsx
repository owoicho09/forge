'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Browse',
    description: 'Explore our store and find the perfect solution for your needs.',
  },
  {
    number: '02',
    title: 'Buy or Order',
    description: 'Purchase ready-to-buy products or request a custom build.',
  },
  {
    number: '03',
    title: 'Receive & Deploy',
    description: 'Get your product and integrate it into your workflow immediately.',
  },
]

export function HowItWorks() {
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
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-16"
        >
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-[#1a1714] mb-4">How It Works</h2>
          <p className="text-slate-600">Three simple steps to get started</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative p-8 bg-slate-50 rounded-lg border border-slate-200"
            >
              {/* Background Number */}
              <div className="absolute top-4 right-4 text-6xl font-syne font-bold text-slate-100">
                {step.number}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#e85d26] text-white flex items-center justify-center font-syne font-bold text-lg mb-4">
                  {index + 1}
                </div>
                <h3 className="font-syne font-bold text-xl text-[#1a1714] mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>

              {/* Connector Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-4 w-8 h-1 bg-gradient-to-r from-[#e85d26] to-transparent" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
