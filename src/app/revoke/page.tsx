"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { getMint, createSetAuthorityInstruction, AuthorityType, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const REVOKE_FEE_LAMPORTS = 0.05 * 10 ** 9; // 0.05 SOL in lamports
const ADMIN_WALLET = new PublicKey("RoyUSr7Av36ovVo52df44Humg1c9Mi3ULhjVanTtJN5"); // Replace with your receiving wallet

const RevokeAuthorityPage = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [tokens, setTokens] = useState<PublicKey[]>([]);
  const [selectedToken, setSelectedToken] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [freezeRevoked, setFreezeRevoked] = useState(false);

  useEffect(() => {
    if (publicKey) {
      fetchMintedTokens();
    }
  }, [publicKey]);

  const fetchMintedTokens = async () => {
    if (!publicKey) return;

    try {
      const userDocRef = doc(db, "tokens", publicKey.toBase58());
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setTokens(userData.tokens.map((mint: string) => new PublicKey(mint)));
      } else {
        setTokens([]);
      }
    } catch (error) {
      console.error("Error fetching tokens from database:", error);
      setTokens([]);
    }
  };

  const handleRevokeAuthority = async (authorityType: AuthorityType) => {
    if (!publicKey || !signTransaction || !selectedToken) {
      return alert("Please connect your wallet & select a token.");
    }

    try {
      setLoading(true);

      // ✅ Step 1: Ensure the user is the current mint authority
      const mintInfo = await getMint(connection, selectedToken, "confirmed", TOKEN_2022_PROGRAM_ID);
      if (!mintInfo.mintAuthority || !mintInfo.mintAuthority.equals(publicKey)) {
        return alert("You are not the current mint authority of this token.");
      }

      // ✅ Step 2: Create transaction to pay the admin fee first
      const feeTransaction = new Transaction();
      const { blockhash: feeBlockhash } = await connection.getLatestBlockhash();
      feeTransaction.recentBlockhash = feeBlockhash;
      feeTransaction.feePayer = publicKey;

      feeTransaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: ADMIN_WALLET,
          lamports: REVOKE_FEE_LAMPORTS,
        })
      );

      // ✅ Step 3: Ask User to Confirm Paying the Fee
      const signedFeeTransaction = await signTransaction(feeTransaction);
      const feeSignature = await connection.sendRawTransaction(signedFeeTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      alert(`Admin Fee Paid! Signature: ${feeSignature}`);

      // ✅ Step 4: Create a new transaction to revoke authority
      const revokeTransaction = new Transaction();
      const { blockhash: revokeBlockhash } = await connection.getLatestBlockhash();
      revokeTransaction.recentBlockhash = revokeBlockhash;
      revokeTransaction.feePayer = publicKey;

      // ✅ Add the revoke instruction with correct program ID
      const revokeAuthorityInstruction = createSetAuthorityInstruction(
        selectedToken,
        publicKey,
        authorityType,
        null,
        [],
        TOKEN_2022_PROGRAM_ID
      );

      revokeTransaction.add(revokeAuthorityInstruction);

      // ✅ Step 5: Ask User to Sign & Confirm Revoke Transaction
      const signedRevokeTransaction = await signTransaction(revokeTransaction);
      const revokeSignature = await connection.sendRawTransaction(signedRevokeTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      alert(`Authority Revoked! Signature: ${revokeSignature}`);

      // ✅ Step 6: If Freeze Authority is revoked, allow Mint Authority revocation
      if (authorityType === AuthorityType.FreezeAccount) {
        setFreezeRevoked(true);
      }
    } catch (error) {
      console.error("Error revoking authority:", error);
      alert("Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 flex-grow"
      >
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Revoke Token Authority</CardTitle>
            <CardDescription className="text-center">
              Select your token and revoke the required authorities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!connected ? (
              <p className="text-center mt-4 text-muted-foreground">
                Please connect your wallet to manage token authorities.
              </p>
            ) : (
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-lg font-medium">Select Your Token:</label>
                  <select
                    className="w-full mt-2 p-2 border rounded-md bg-gray-900 text-white"
                    onChange={(e) => {
                      setSelectedToken(new PublicKey(e.target.value));
                      setFreezeRevoked(false); // Reset freeze state when selecting a new token
                    }}
                    value={selectedToken?.toBase58() || ""}
                  >
                    <option value="" disabled>Select a token</option>
                    {tokens.map((token) => (
                      <option key={token.toBase58()} value={token.toBase58()}>{token.toBase58()}</option>
                    ))}
                  </select>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={() => handleRevokeAuthority(AuthorityType.FreezeAccount)}
              disabled={!selectedToken || loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md flex items-center gap-2 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Revoke Freeze Authority (0.05 SOL)"
              )}
            </Button>

            <Button
              onClick={() => handleRevokeAuthority(AuthorityType.MintTokens)}
              disabled={!freezeRevoked || !selectedToken || loading}
              className={`px-6 py-3 rounded-md flex items-center gap-2 w-full ${
                freezeRevoked ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Revoke Mint Authority (0.05 SOL)"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RevokeAuthorityPage;
