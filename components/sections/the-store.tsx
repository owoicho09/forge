'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { products, productCategories, type Product } from '@/lib/products'
import { ProductCard } from '@/components/product-card'

export function TheStore() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = products.filter(
    (product) => selectedCategory === 'all' || product.category === selectedCategory
  )

  return (
    <section id="store" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-12"
        >
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-[#1a1714] mb-4">The Store</h2>
          <p className="text-slate-600">Explore our curated collection of premium products</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {productCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-[#e85d26] text-white shadow-lg'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-[#e85d26]'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-600">No products found in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
