'use client'

import React, { useState, useEffect } from 'react';
import { mintTo, getOrCreateAssociatedTokenAccount } from '../../../../config/solana';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Coins, AlertCircle } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import TokenInfoSection from '@/components/token-info';

const MintTokens = () => {
    const params = useParams();
    const mintAddress = params.mintAddress as string;
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [mintAmount, setMintAmount] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const wallet = useWallet();

    // Update destination address when wallet connects
    useEffect(() => {
        if (wallet.publicKey) {
            setDestinationAddress(wallet.publicKey.toBase58());
        } else {
            setDestinationAddress('');
        }
    }, [wallet.publicKey]);

    // useEffect(() => {
    //     if (status.type) {
    //         const timer = setTimeout(() => setStatus({ type: null, message: '' }), 5000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!publicKey) {
            setStatus({ type: 'error', message: 'Please connect your wallet' });
            return;
        }

        try {
            setLoading(true);
            if (!wallet.publicKey) {
                throw new Error('Wallet not connected');
            }

            // Determine destination address - use input if provided, otherwise use connected wallet
            let destinationPublicKey;
            try {
                destinationPublicKey = new PublicKey(destinationAddress);
            } catch (error) {
                console.error('Error parsing destination address:', error);
                throw new Error('Invalid destination address');
            }

            const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
                new PublicKey(mintAddress),
                wallet,
                destinationPublicKey,
            );
            
            const amount = parseInt(mintAmount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount');
            }

            const signature = await mintTo(
                new PublicKey(mintAddress),
                {
                    publicKey,
                    sendTransaction,
                },
                associatedTokenAccount,
                wallet.publicKey,
                amount,
            );
            
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            if (confirmation.value.err) {
                throw new Error('Transaction failed to confirm');
            }

            setStatus({ type: 'success', message: `Successfully minted ${amount} tokens to ${destinationPublicKey.toBase58()}` });
            setMintAmount('');
            
        } catch (error:unknown) {
            console.error('Error minting tokens:', error);
            setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to mint tokens' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <TokenInfoSection/>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 max-w-md"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Mint Tokens</CardTitle>
                    <CardDescription>Create new tokens for the selected mint address</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 p-3 bg-secondary/50 rounded-lg">
                        <Label className="text-sm font-medium text-secondary-foreground">Token Mint Address:</Label>
                        <p className="font-mono text-sm break-all text-secondary-foreground">{mintAddress}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="destinationAddress">Destination Address:</Label>
                            <Input
                                type="text"
                                id="destinationAddress"
                                value={destinationAddress}
                                onChange={(e) => setDestinationAddress(e.target.value)}
                                placeholder="Enter destination address"
                                disabled={loading}
                            />
                            <p className="text-sm text-muted-foreground">
                                Your connected wallet address is shown by default. You can modify it to mint to a different address.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mintAmount">Amount to Mint:</Label>
                            <Input
                                type="number"
                                id="mintAmount"
                                value={mintAmount}
                                onChange={(e) => setMintAmount(e.target.value)}
                                placeholder="Enter mint amount"
                                required
                                min="1"
                                disabled={loading}
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !publicKey}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Coins className="mr-2 h-4 w-4" />
                                Mint Tokens
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {status.type && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                >
                    <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{status.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                        <AlertDescription>{status.message}</AlertDescription>
                    </Alert>
                </motion.div>
            )}
        </motion.div>
        <Footer />
        </div>
    );
};

export default MintTokens;
