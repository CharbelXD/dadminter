"use client";
import React, { useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Adapter } from "@solana/wallet-adapter-base"; // ✅ Correct import for wallet adapters

import "@solana/wallet-adapter-react-ui/styles.css";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [wallets, setWallets] = useState<Adapter[]>([]); // ✅ Corrected type for wallet adapters

  useEffect(() => {
    setWallets([new PhantomWalletAdapter(), new SolflareWalletAdapter()]);
  }, []);

  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
