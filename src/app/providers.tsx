'use client'
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

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