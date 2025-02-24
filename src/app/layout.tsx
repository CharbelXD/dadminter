import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import ClientOnly from "../components/client-only"; // ✅ Import the new Client Component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DAD MINTER - Create and Manage Solana Tokens",
  description:
    "Launch your own Solana token with ease using SolanaLauncher. Create, mint, and manage tokens on the Solana blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientOnly>{children}</ClientOnly> {/* ✅ Wrap Client Components */}
        </Providers>
      </body>
    </html>
  );
}
