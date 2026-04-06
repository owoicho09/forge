'use client'

import { motion } from 'framer-motion'
import { products } from '@/lib/products'
import { WHATSAPP_URL } from '@/lib/constants'
import { Check, ArrowRight } from 'lucide-react'

const featured = products.find((p) => p.id === 'c1') || products[0]

const categoryStyles = {
  ready: {
    pill: 'bg-orange-50 text-[#e85d26] border border-orange-100',
    iconBg: 'from-orange-50 to-orange-100',
    iconColor: '#e85d26',
    label: 'Ready to Buy',
  },
  custom: {
    pill: 'bg-blue-50 text-[#2979ff] border border-blue-100',
    iconBg: 'from-blue-50 to-blue-100',
    iconColor: '#2979ff',
    label: 'Custom Build',
  },
  idea: {
    pill: 'bg-yellow-50 text-[#d4a017] border border-yellow-100',
    iconBg: 'from-yellow-50 to-yellow-100',
    iconColor: '#d4a017',
    label: 'Idea for Sale',
  },
}

export function FeaturedDrop() {
  const style = categoryStyles[featured.category]
  const Icon = featured.icon

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${featured.name} — can you share more details?`
  )
  const whatsappLink = `${WHATSAPP_URL}?text=${whatsappMessage}`

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-50px' }}
          className="mb-8"
        >
          <p className="text-xs font-medium text-[#e85d26] uppercase tracking-widest mb-1">
            Featured Drop
          </p>
          <h2 className="font-syne font-extrabold text-2xl sm:text-3xl text-[#1a1714]">
            Product of the week.
          </h2>
        </motion.div>

        {/* Featured card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="relative bg-[#0f1923] rounded-2xl overflow-hidden"
        >
          {/* Featured ribbon */}
          <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none">
            <div className="absolute top-5 right-[-28px] w-32 bg-[#e85d26] text-white text-[9px] font-bold tracking-widest uppercase text-center py-1.5 rotate-45">
              Featured
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Left — content */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: '-50px' }}
              className="p-8 sm:p-10 flex flex-col justify-between"
            >
              <div>
                {/* Category pill */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-5 ${style.pill}`}>
                  {style.label}
                </span>

                {/* Niche tag */}
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
                  {featured.niche}
                </p>

                {/* Name + inline icon on mobile */}
                <div className="flex items-start gap-1 mb-0">
                  {/* Mobile only icon — hidden on md+ */}

                  <h3 className="font-syne font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                    {featured.name}
                  </h3>
                </div>

                {/* Benefits */}
                <ul className="space-y-3 mb-8">
                  {featured.benefits.map((benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed"
                    >
                      <Check
                        size={14}
                        className="mt-0.5 flex-shrink-0 text-[#e85d26]"
                      />
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                  Starting at
                </p>
                <p className="font-syne font-extrabold text-3xl text-white mb-6">
                  {featured.priceLabel}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.a
                    whileHover={{ scale: 1.03, backgroundColor: '#e85d26' }}
                    whileTap={{ scale: 0.97 }}
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white text-[#1a1714] font-semibold py-3 px-6 rounded-lg text-sm text-center transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Order Now <ArrowRight size={14} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={featured.telegramDemoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-slate-600 text-slate-300 font-medium py-3 px-6 rounded-lg text-sm text-center hover:border-slate-400 hover:text-white transition-colors"
                  >
                    View Demo
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* Right — visual — hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true, margin: '-50px' }}
              className={`hidden md:flex items-center justify-center bg-gradient-to-br ${style.iconBg} m-6 rounded-xl min-h-[240px]`}
            >
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                >
                  {Icon && (
                    <Icon
                      size={48}
                      color={style.iconColor}
                      strokeWidth={1.4}
                    />
                  )}
                </div>
                <p className="font-syne font-bold text-sm text-slate-500 text-center px-4">
                  {featured.niche}
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}