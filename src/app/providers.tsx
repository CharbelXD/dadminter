'use client'
import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export interface ProvidersProps {
  children: React.ReactNode;
}



export function Providers({ children }: ProvidersProps) {
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
           {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}