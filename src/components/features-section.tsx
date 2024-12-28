'use client'

import { motion } from 'framer-motion'
import { Rocket, Coins, Zap, Shield } from 'lucide-react'

const features = [
  {
    name: 'Easy Token Creation',
    description: 'Create your Solana token in minutes with our intuitive interface.',
    icon: Rocket,
  },
  {
    name: 'Secure Minting',
    description: 'Mint tokens securely with our advanced blockchain integration.',
    icon: Coins,
  },
  {
    name: 'Fast Transactions',
    description: 'Experience lightning-fast token transactions on the Solana network.',
    icon: Zap,
  },
  {
    name: 'Robust Security',
    description: 'Your tokens are protected by state-of-the-art security measures.',
    icon: Shield,
  },
]

const FeaturesSection = () => {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything you need to launch your token
          </p>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
            Our platform provides all the tools and features you need to create, mint, and manage your Solana tokens efficiently.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-background">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-foreground">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-muted-foreground">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

