'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion' // Import animation library
import { Button } from '@/components/ui/button'

const contractAddress = "To Be Announced";
const totalSupply = "1,000,000,000"; // Total supply of tokens

// Tokenomics Data
const tokenomicsData = [
  { name: 'Team', value: 15, color: '#FF6384' },
  { name: 'Marketing', value: 10, color: '#36A2EB' },
  { name: 'Liquidity', value: 20, color: '#FFCE56' },
  { name: 'Presale', value: 20, color: '#4BC0C0' },
  { name: 'Partners', value: 15, color: '#9966FF' },
  { name: 'Burn', value: 5, color: '#14F195' },
  { name: 'Staking', value: 15, color: '#9945FF' },
];

// Roadmap Data (Milestones)
const roadmap = [
  { title: 'Phase 1', description: 'Launch of The Token and Website on Mainnet' },
  { title: 'Phase 2', description: 'Presale and Marketing and Community Growth' },
  { title: 'Phase 3', description: 'Partners and Influencers and Burning' },
  { title: 'Phase 4', description: 'Staking and Exchanges listings' },
];

const TokensSection = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Fixed TypeScript error

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-20 sm:py-32 bg-[#1a1a2e] overflow-hidden">
      {/* Dust Particles Animation (90 particles) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="dust-container">
          {Array.from({ length: 90 }).map((_, i) => (
            <div
              key={i}
              className="dust"
              style={{
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                animationDuration: `${Math.random() * 5 + 3}s`,
                opacity: Math.random() * 0.6 + 0.2,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Coin Introduction Section */}
        <div className="text-center text-[#f9f9f8] mb-10">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            $DAD TOKEN
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            $DAD is a revolutionary utility token built on the Solana blockchain, designed for fast transactions, security, and scalability. Join us and be part of the future!
          </p>
        </div>

        {/* Contract Address Section */}
        <div className="bg-[#25253a] rounded-lg p-4 shadow-lg text-center text-white max-w-lg mx-auto relative z-10">
          <h3 className="text-lg font-semibold">Contract Address</h3>
          <p className="mt-2 text-sm text-gray-400 break-all bg-[#1a1a2e] p-2 rounded-md">
            {contractAddress}
          </p>
          <Button 
            onClick={handleCopy} 
            className="mt-3 px-4 py-2 bg-white text-black hover:bg-gray-200 border border-gray-300 shadow text-sm"
          >
            {copied ? "Copied!" : "Copy Address"}
          </Button>
        </div>

        {/* Tokenomics Section */}
        <div className="mt-16 text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-[#f9f9f8] sm:text-4xl">
            Tokenomics
          </h2>
          <p className="mt-4 text-xl text-gray-300">
          Here&apos;s  how the total supply of tokens is allocated.
          </p>

          {/* Total Supply Section */}
          <div className="mt-6 text-center bg-[#25253a] text-white p-4 rounded-lg shadow-md max-w-md mx-auto">
            <h3 className="text-lg font-semibold">Total Supply</h3>
            <p className="text-2xl font-bold text-[#36A2EB]">{totalSupply} Tokens</p>
          </div>

          {/* Loading Animation */}
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-blue-500 border-opacity-75"></div>
            </div>
          ) : (
            <div className="flex justify-center mt-10 transition-opacity duration-1000 opacity-100">
              <ResponsiveContainer width={360} height={360}>
                <PieChart>
                  <Pie
                    data={tokenomicsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={5}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                    labelLine={false}
                  >
                    {tokenomicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#222" strokeWidth={1.5} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ color: "white", fontSize: "14px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Animated Roadmap Section (Press to Expand) */}
        <div className="mt-20 text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-[#f9f9f8] sm:text-4xl">
            Roadmap
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Our journey to success, step by step. Tap on a milestone to expand.
          </p>

          <div className="mt-8 max-w-3xl mx-auto space-y-6">
            {roadmap.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.3 }}
                whileTap={{ scale: 1.05 }}
                onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
                className="bg-[#25253a] p-5 rounded-lg shadow-lg text-white cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-[#36A2EB]">{item.title}</h3>
                <p className={`mt-2 text-gray-300 transition-all duration-300 ${
                  expandedIndex === index ? "block" : "hidden"
                }`}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokensSection;
