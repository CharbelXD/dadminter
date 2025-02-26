"use client";

import React from "react";
import RevokeAuthorityPage from "@/components/revoke-auth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

const RevokeAuthPage = () => {
  const { publicKey, connected } = useWallet();

  if (!publicKey) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl">Connect Your Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">Please connect your wallet to revoke token authorities.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Revoke Token Authority</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Connected Wallet: {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
              </p>
            </CardContent>
          </Card>

          {/* Load Revoke Authority Component */}
          <RevokeAuthorityPage />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default RevokeAuthPage;
