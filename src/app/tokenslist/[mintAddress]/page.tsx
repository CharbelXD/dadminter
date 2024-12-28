'use client'
import React, { useState } from 'react';
import { mintTo, getOrCreateAssociatedTokenAccount } from '../../../../config/solana';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

const MintTokens = () => {
    const params = useParams();
    const mintAddress = params.mintAddress as string;
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [toAddress, setToAddress] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const wallet = useWallet();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!publicKey) {
            alert('Please connect your wallet');
            return;
        }

        try {
            setLoading(true);
            if (!wallet.publicKey) {
                alert('Please connect your wallet');
                return;
            }

            console.log('Creating or getting associated token account...');
            const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
                new PublicKey(mintAddress), // Add mint address from URL,
                wallet, // wallet
                wallet.publicKey, // owner
            );
            
            console.log('Associated token account:', associatedTokenAccount.address.toString());

            // Validate amount
            const amount = parseInt(mintAmount);
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount');
                setLoading(false);
                return;
            }

            console.log('Starting mint transaction...');
            const signature = await mintTo(
                new PublicKey(mintAddress), // Add mint address from URL
                {
                    publicKey,
                    sendTransaction,
                },
                associatedTokenAccount.address, // Use the associated token account address
                publicKey, // authority
                amount,
            );

            console.log('Mint transaction signature:', signature);
            
            // Wait for confirmation
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            if (confirmation.value.err) {
                throw new Error('Transaction failed to confirm');
            }

            alert(`Successfully minted ${amount} tokens to ${wallet.publicKey?.toBase58()}`);
            
            // Clear form after successful mint
            setToAddress('');
            setMintAmount('');
        } catch (error: any) {
            console.error('Error minting tokens:', error);
            alert(`Failed to mint tokens: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Mint Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Token Mint Address:</p>
                        <p className="font-mono text-sm break-all">{mintAddress}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                  
                        <div className="space-y-2">
                            <label htmlFor="mintAmount" className="block text-sm font-medium">
                                Amount to Mint:
                            </label>
                            <input
                                type="number"
                                id="mintAmount"
                                value={mintAmount}
                                onChange={(e) => setMintAmount(e.target.value)}
                                placeholder="Enter mint amount"
                                className="w-full p-2 border rounded"
                                required
                                min="1"
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !publicKey}
                            className={`w-full p-2 rounded ${
                                loading || !publicKey
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                            {loading ? 'Processing...' : 'Mint Tokens'}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MintTokens;