'use client'

import { motion } from 'framer-motion'
import { Product } from '@/lib/products'
import { WHATSAPP_URL } from '@/lib/constants'
interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const borderColorMap = {
    accent: 'border-t-[#e85d26]',
    blue: 'border-t-[#3b82f6]',
    gold: 'border-t-[#d4af37]',
  }

  const categoryLabels = {
    ready: 'Ready to Buy',
    custom: 'Custom Builds',
    idea: 'Ideas for Sale',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      className={`group bg-white border-t-4 ${borderColorMap[product.borderColor]} rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow`}
    >
      {/* Thumbnail */}
      <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">
        {product.emoji}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Pill */}
        <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700 mb-3">
          {categoryLabels[product.category]}
        </div>

        {/* Name */}
        <h3 className="font-syne font-bold text-lg text-[#1a1714] mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Forge Score */}
        <div className="space-y-2 mb-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>Revenue Potential </span>
              <span>{product.forgeScore.revenuePotential}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#e85d26] to-orange-400"
                style={{ width: `${product.forgeScore.revenuePotential}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>Delivery Speed</span>
              <span>{product.forgeScore.deployTime}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3b82f6] to-blue-400"
                style={{ width: `${product.forgeScore.deployTime}%` }}
              />
            </div>
          </div>


        </div>

        {/* Price */}
        <p className="font-syne font-bold text-lg text-[#1a1714] mb-4">{product.priceLabel}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
              onClick={() => window.open(WHATSAPP_URL, "_blank")}
              className="flex-1 bg-[#1a1714] text-white font-medium py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors text-sm"
            >
              Order Now
            </button>
          <a
            href={product.telegramDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-[#1a1714] text-[#1a1714] font-medium py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            View Demo
          </a>
        </div>
      </div>
    </motion.div>
  )
}
