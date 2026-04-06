'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Wrench, Lightbulb } from 'lucide-react'

const features = [
  {
    icon: ShoppingBag,
    name: 'Ready to Buy',
    description:
      'Finished products you can own and deploy immediately. Pay once, receive the full build. No waiting, no back and forth.',
    color: '#e85d26',
    bg: 'rgba(232,93,38,0.06)',
  },
  {
    icon: Wrench,
    name: 'Custom Builds',
    description:
      'Describe exactly what you need and get a quote. Built to your specification, delivered fast, fully yours on completion.',
    color: '#2979ff',
    bg: 'rgba(41,121,255,0.06)',
  },
  {
    icon: Lightbulb,
    name: 'Ideas for Sale',
    description:
      'Fully researched concepts with market analysis, feature specs, and execution plans. Buy the idea, own it entirely.',
    color: '#d4a017',
    bg: 'rgba(212,160,23,0.06)',
  },
]

export function WhatYouGet() {
  return (
    <section className="py-16 sm:py-24 bg-[#f8f9fb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="mb-12"
        >
          <p className="text-xs font-medium text-[#e85d26] uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="font-syne font-extrabold text-3xl sm:text-4xl text-[#1a1714] leading-tight">
            Three ways to get<br />something built.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{ y: -4 }}
                className="p-8 bg-white border border-[#eaedf2] rounded-xl hover:shadow-md transition-all"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: feature.bg }}
                >
                  <Icon size={22} color={feature.color} strokeWidth={1.8} />
                </div>
                <h3 className="font-syne font-bold text-lg text-[#1a1714] mb-3">
                  {feature.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}