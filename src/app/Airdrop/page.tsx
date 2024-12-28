'use client'
import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Loader2 } from "lucide-react";

function SolAirdrop() {
  const [solanaPublicKey, setSolanaPublicKey] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isAirdropped, setIsAirdropped] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connection = new Connection("https://api.devnet.solana.com");

  const getBalance = async (pubKey: string) => {
    try {
      const publicKeyObject = new PublicKey(pubKey);
      const balance = await connection.getBalance(publicKeyObject);
      setBalance(balance / 1e9); // Convert lamports to SOL
    } catch (err) {
      setBalance(0);
    }
  };

  useEffect(() => {
    if (solanaPublicKey.length === 44) {
      getBalance(solanaPublicKey);
    }
  }, [solanaPublicKey, isAirdropped]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const publicKeyObject = new PublicKey(solanaPublicKey);
      const txhash = await connection.requestAirdrop(publicKeyObject, 1e9);
      setTxHash(txhash);
      setIsAirdropped(true);
      
      // Wait for confirmation and update balance
      await connection.confirmTransaction(txhash);
      await getBalance(solanaPublicKey);
    } catch (err) {
      setError("Invalid Solana address or airdrop failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Solana Devnet Airdrop
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            This tool only works on Devnet and does <strong>NOT</strong> provide real $SOL tokens.
          </AlertDescription>
        </Alert>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-medium">
              Solana Address
            </label>
            <input
              type="text"
              name="search"
              placeholder="Enter your Solana address..."
              id="search"
              value={solanaPublicKey}
              onChange={(e) => setSolanaPublicKey(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isAirdropped ? "border-green-500" : "border-gray-300"
              }`}
            />
          </div>

          {balance !== null && (
            <div className="text-sm text-gray-600">
              Current Balance: {balance.toFixed(4)} SOL
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {isAirdropped && (
            <Alert className="bg-green-50">
              <AlertDescription className="text-green-800">
                Successfully airdropped 1 SOL! Transaction Hash: {txHash.slice(0, 8)}...
              </AlertDescription>
            </Alert>
          )}

          <button
            type="submit"
            disabled={loading || solanaPublicKey.length !== 44}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Airdropping...
              </span>
            ) : (
              "Airdrop 1 SOL"
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

export default SolAirdrop;