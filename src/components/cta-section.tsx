'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const CtaSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to launch your Solana token?
          </h2>
          <p className="mt-4 text-xl">
            Join thousands of projects already using our platform to create and manage their tokens.
          </p>
  
          {/* Buttons - Now Mobile Responsive */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/airdrop">Get Airdrop</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/create-mint">Create Token</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/revoke">Revoke Authorities</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );  
}

export default CtaSection

