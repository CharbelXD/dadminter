'use client';
import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import DevnetInfoSection from "@/components/devent-info-section";

// Move this outside the component
const connection = new Connection("https://devnet.helius-rpc.com/?api-key=b8958924-1fba-40a9-8f4c-81979fb8a4c7");

async function getBalance(pubKey: string) {
  try {
    const publicKeyObject = new PublicKey(pubKey);
    const balance = await connection.getBalance(publicKeyObject);
    return balance / 1e9;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function SolAirdrop() {
  const [solanaPublicKey, setSolanaPublicKey] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isAirdropped, setIsAirdropped] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (solanaPublicKey.length === 44) {
      getBalance(solanaPublicKey).then(setBalance);
    } else {
      setBalance(null);
    }
  }, [solanaPublicKey, isAirdropped]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsAirdropped(false);
    
    try {
      const publicKeyObject = new PublicKey(solanaPublicKey);
      const txhash = await connection.requestAirdrop(publicKeyObject, 1e9);
      setTxHash(txhash);
      setIsAirdropped(true);
      
      await connection.confirmTransaction(txhash);
      const updatedBalance = await getBalance(solanaPublicKey);
      setBalance(updatedBalance);
    } catch (err) {
      console.error(err);
      setError("Invalid Solana address or airdrop failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <DevnetInfoSection />
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Solana Devnet Airdrop</CardTitle>
            <CardDescription>Request test SOL tokens for development purposes</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This tool only works on Devnet and does <strong>NOT</strong> provide real $SOL tokens.
              </AlertDescription>
            </Alert>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="solana-address" className="block text-sm font-medium">
                  Solana Address
                </label>
                <Input
                  type="text"
                  id="solana-address"
                  placeholder="Enter your Solana address..."
                  value={solanaPublicKey}
                  onChange={(e) => setSolanaPublicKey(e.target.value)}
                  className={isAirdropped ? "border-green-500" : ""}
                />
              </div>

              {balance !== null && (
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <span className="text-sm">Current Balance: {balance.toFixed(4)} SOL</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isAirdropped && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Successfully airdropped 1 SOL! Transaction Hash: {txHash.slice(0, 8)}...
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Airdropping...
                  </span>
                ) : (
                  "Airdrop 1 SOL"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default SolAirdrop;
