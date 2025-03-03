'use client'

import { motion } from 'framer-motion'
import { FaTwitter, FaTelegram, FaReddit, FaYoutube, FaTiktok } from 'react-icons/fa'

const Footer = () => {
  const socialLinks = [
    { Icon: FaTwitter, url: "https://x.com/MinterDadSolana" },
    { Icon: FaTelegram, url: "https://t.me/DADminterSolanaChat" },
    { Icon: FaReddit, url: "https://www.reddit.com/u/DadMinterSolana/" },
    { Icon: FaYoutube, url: "https://youtube.com/@dadmintersolana" },
    { Icon: FaTiktok, url: "https://www.tiktok.com/@dad.minter.solana" },
  ]

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-background border-t border-gray-900 text-black py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Solana DAD</h3>
            <p className="text-gray-400">Empowering the Solana ecosystem, one token at a time.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-2">
              {['Airdrop', 'Create-Mint', 'Tokens', 'Revoke'].map((item) => (
                <li key={item}>
                  <a href={`/${item.toLowerCase().replace(' ', '')}`} className="text-gray-400 hover:text-white transition duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-2">Connect With Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, url }, index) => (
                <a 
                  key={index} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DAD MINTER. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
