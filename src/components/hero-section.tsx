'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-b from-primary/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div 
            className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl tracking-tight font-extrabold text-primary sm:text-5xl md:text-6xl">
              Launch Your Solana Token
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Create, mint, and manage your Solana tokens with ease. Start your journey into the world of decentralized finance today.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <Button asChild size="lg" className="mr-4">
                <Link href="/create-mint">Create Token</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/tokens">Explore Tokens</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div 
            className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <img
                className="w-full rounded-lg"
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Solana token visualization"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

