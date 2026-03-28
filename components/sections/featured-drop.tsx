'use client'

import { motion } from 'framer-motion'
import { products } from '@/lib/products'

const featured = products[0] // Coach AI Assistant

export function FeaturedDrop() {
  const categoryLabels = {
    ready: 'Ready to Buy',
    custom: 'Custom Builds',
    idea: 'Ideas for Sale',
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden shadow-lg border border-slate-200"
        >
          {/* Featured Ribbon */}
          <motion.div
            initial={{ opacity: 0, rotate: 45 }}
            whileInView={{ opacity: 1, rotate: -5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute -top-9 -right-8 w-31 h-31 bg-[#e85d26] text-white font-syne font-bold text-sm flex items-center justify-center transform rotate-45 shadow-lg"
          >
            FEATURED
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 sm:p-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-50px' }}
              className="flex flex-col justify-between"
            >
              {/* Category */}
              <div>
                <div className="inline-block px-3 py-1 bg-[#e85d26]/10 text-[#e85d26] rounded-full text-xs font-bold uppercase mb-4">
                  {categoryLabels[featured.category]}
                </div>

                {/* Name */}
                <h3 className="font-syne font-bold text-3xl sm:text-4xl text-[#1a1714] mb-4">{featured.name}</h3>

                {/* Description */}
                <p className="text-slate-600 text-base leading-relaxed mb-8">{featured.description}</p>

                {/* Forge Score */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Forge Score</p>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                      <span>Revenue Potential</span>
                      <span>{featured.forgeScore.revenuePotential}%</span>
                    </div>
                    <div className="h-2 bg-slate-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#e85d26] to-orange-400"
                        style={{ width: `${featured.forgeScore.revenuePotential}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                      <span>Deploy Speed</span>
                      <span>{featured.forgeScore.deployTime}%</span>
                    </div>
                    <div className="h-2 bg-slate-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3b82f6] to-blue-400"
                        style={{ width: `${featured.forgeScore.deployTime}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-50px' }}
              className="flex flex-col justify-between"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center text-7xl mb-8">
                {featured.emoji}
              </div>

              {/* Price & CTA */}
              <div>
                <p className="font-syne font-bold text-2xl text-[#1a1714] mb-6">{featured.priceLabel}</p>

                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-[#1a1714] text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Order Now
                  </motion.button>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={featured.telegramDemoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-3 border-2 border-[#1a1714] text-[#1a1714] font-semibold rounded-lg hover:bg-slate-100 transition-colors text-center"
                  >
                    View Demo
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
