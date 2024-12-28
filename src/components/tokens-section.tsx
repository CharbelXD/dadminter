'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const tokens = [
  { name: 'SolToken', symbol: 'SOL', price: '$32.45' },
  { name: 'LunaToken', symbol: 'LUNA', price: '$0.89' },
  { name: 'StarToken', symbol: 'STAR', price: '$1.23' },
]

const TokensSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          Featured Tokens
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Explore some of the popular tokens launched on our platform.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token, index) => (
            <motion.div
              key={token.name}
              className="bg-card rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-foreground">{token.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Symbol: {token.symbol}</p>
                <p className="mt-2 text-2xl font-semibold text-primary">{token.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link href="/tokens">View All Your Tokens</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default TokensSection

