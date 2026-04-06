'use client'

import { motion } from 'framer-motion'
import { Product } from '@/lib/products'
import { WHATSAPP_URL } from '@/lib/constants'
import { Check } from 'lucide-react'

interface ProductCardProps {
  product: Product
  index?: number
}

const categoryStyles = {
  ready: {
    pill: 'bg-orange-50 text-[#e85d26] border border-orange-100',
    iconBg: 'from-orange-50 to-orange-100',
    iconColor: '#e85d26',
    border: 'border-t-[#e85d26]',
    label: 'Ready to Buy',
  },
  custom: {
    pill: 'bg-blue-50 text-[#2979ff] border border-blue-100',
    iconBg: 'from-blue-50 to-blue-100',
    iconColor: '#2979ff',
    border: 'border-t-[#2979ff]',
    label: 'Custom Build',
  },
  idea: {
    pill: 'bg-yellow-50 text-[#d4a017] border border-yellow-100',
    iconBg: 'from-yellow-50 to-yellow-100',
    iconColor: '#d4a017',
    border: 'border-t-[#d4a017]',
    label: 'Idea for Sale',
  },
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const style = categoryStyles[product.category]

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${product.name} — can you share more details?`
  )
  const whatsappLink = `${WHATSAPP_URL}?text=${whatsappMessage}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      className={`group bg-white border border-[#eaedf2] border-t-4 ${style.border} rounded-xl overflow-hidden transition-all`}
    >
      {/* Thumbnail */}
      <div
        className={`h-36 bg-gradient-to-br ${style.iconBg} flex items-center justify-center`}
      >
        {product.icon && (
          <product.icon
            size={40}
            color={style.iconColor}
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Category pill */}
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${style.pill}`}>
          {style.label}
        </span>

        {/* Name */}
        <h3 className="font-syne font-bold text-base text-[#1a1714] mb-3 leading-snug">
          {product.name}
        </h3>

        {/* Benefits */}
        <ul className="space-y-2 mb-4">
          {product.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
              <Check size={12} className="mt-0.5 flex-shrink-0 text-[#e85d26]" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Price */}
        <p className="font-syne font-extrabold text-xl text-[#1a1714] mb-4">
          {product.priceLabel}
        </p>

        {/* CTA */}
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#1a1714] text-white text-center font-medium py-2.5 rounded-lg hover:bg-[#e85d26] transition-colors text-sm"
        >
          Order on WhatsApp
        </motion.a>

      </div>
    </motion.div>
  )
}