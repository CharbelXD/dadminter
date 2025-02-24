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
    <section className="relative py-20 sm:py-32 bg-[#1a1a2e] overflow-hidden">
      {/* Fire Dust Animation Container */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="fire-dust"></div>
      </div>
  
      {/* Content Wrapper */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-base text-[#fbfbfa] font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Everything you need to launch your token
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
            Our platform provides all the tools and features you need to create, mint, and manage your Solana tokens efficiently.
          </p>
        </div>
  
        {/* Feature List */}
        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="relative flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#fefdfb] text-black shadow-lg">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-white">{feature.name}</dt>
                  <dd className="mt-2 text-base text-gray-300">{feature.description}</dd>
                </div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );  
}

export default FeaturesSection

