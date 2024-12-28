'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Coins, Menu, X } from 'lucide-react'
import { WalletDisconnectButton,
    WalletMultiButton} from '@solana/wallet-adapter-react-ui';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Coins className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Solana-Token-Launcher
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/airdrop">Airdrop</Link>
            <Link href="/create-mint">Create Mint</Link>
            <Link href="/tokens">Tokens</Link>
          </nav>
        </div>
        <Button
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border/40 md:hidden">
            <nav className="flex flex-col space-y-4 p-4">
              <Link href="/airdrop" onClick={() => setIsMenuOpen(false)}>Airdrop</Link>
              <Link href="/create-mint" onClick={() => setIsMenuOpen(false)}>Create Mint</Link>
              <Link href="/tokens" onClick={() => setIsMenuOpen(false)}>Tokens</Link>
              <Link href="/mint" onClick={() => setIsMenuOpen(false)}>Mint Tokens</Link>
            </nav>
          </div>
        )}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <Button asChild>
              <Link href="/create-mint">Launch Token</Link>
            </Button>
            <WalletMultiButton />
            <WalletDisconnectButton />

          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

