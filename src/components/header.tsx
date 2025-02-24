"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coins, Menu, X } from "lucide-react";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
const WalletDisconnectButtonDynamic = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletDisconnectButton),
  { ssr: false }
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link className="flex items-center space-x-2" href="/">
          <Coins className="h-6 w-6" />
          <span className="font-bold sm:inline-block">Solana DAD MINTER</span>
        </Link>
  
        {/* Desktop Navigation (Hidden on Small Screens) */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/airdrop">Airdrop</Link>
          <Link href="/create-mint">Create Mint</Link>
          <Link href="/tokens">Tokens</Link>
        </nav>
  
        {/* Mobile Menu Button */}
        <Button
          className="md:hidden flex items-center justify-center rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
  
        {/* Mobile Menu (Visible when Open) */}
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
  
        {/* Wallet & CTA Buttons (For Desktop & Mobile) */}
        <div className="hidden md:flex items-center space-x-6">
          <Button asChild>
            <Link href="/create-mint">Launch Token</Link>
          </Button>
          <WalletMultiButtonDynamic />
          <WalletDisconnectButtonDynamic />
        </div>
      </div>
    </header>
  );  
};

export default Header;
