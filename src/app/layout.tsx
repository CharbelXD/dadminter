import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'SolanaLauncher - Create and Manage Solana Tokens',
  description: 'Launch your own Solana token with ease using SolanaLauncher. Create, mint, and manage tokens on the Solana blockchain.',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>   
           <Providers>
        {children}

      </Providers>
      </body>
    </html>
  );
}
