'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const tokens = [
  { name: 'NONE YET', symbol: 'NONE', price: 'NONE' },
  
]

const TokensSection = () => {
  return (
    <section className="relative py-20 sm:py-32 bg-[#1a1a2e] overflow-hidden">
      {/* Dust Particles Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="dust-container">
          <div className="dust"></div>
          <div className="dust"></div>
          <div className="dust"></div>
          <div className="dust"></div>
          <div className="dust"></div>
          <div className="dust"></div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-extrabold text-[#f9f9f8] sm:text-4xl text-center">
          Featured Tokens
        </h2>
        <p className="mt-4 text-xl text-gray-300 text-center">
          Explore some of the popular tokens launched on our platform.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token, index) => (
            <motion.div
              key={token.name}
              className="bg-[#25253a] rounded-lg shadow-lg overflow-hidden p-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-medium text-white">{token.name}</h3>
              <p className="mt-1 text-sm text-gray-400">Symbol: {token.symbol}</p>
              <p className="mt-2 text-2xl font-semibold text-[#f9f9f8]">{token.price}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
  <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 border border-gray-300 shadow">
    <Link href="/tokens">View All Your Tokens</Link>
  </Button>
</div>
      </div>
    </section>
  )
};

export default TokensSection

