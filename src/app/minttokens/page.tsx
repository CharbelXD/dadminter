// MintTokens.tsx
'use client'
import React, { useState } from 'react';
import { mintTo, getOrCreateAssociatedTokenAccount } from '../../../config/solana';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const MintTokens = () => {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [toAddress, setToAddress] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!publicKey) {
            alert('Please connect your wallet');
            return;
        }

        try {
            setLoading(true);
            
            // Validate destination address
            let destinationAddress: PublicKey;
            try {
                destinationAddress = new PublicKey(toAddress);
            } catch (error) {
                alert('Invalid destination address');
                setLoading(false);
                return;
            }

            // First, ensure the destination has an associated token account
            console.log('Creating or getting associated token account...');
            const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
                publicKey, // wallet
                destinationAddress, // owner
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
                {
                    publicKey,
                    sendTransaction,
                },
                associatedTokenAccount.address, // Use the associated token account address
                publicKey, // authority
                amount
            );

            console.log('Mint transaction signature:', signature);
            
            // Wait for confirmation
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            if (confirmation.value.err) {
                throw new Error('Transaction failed to confirm');
            }

            alert(`Successfully minted ${amount} tokens to ${destinationAddress.toString()}`);
            
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
            <h2 className="text-2xl font-bold mb-4">Mint Tokens</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="to" className="block text-sm font-medium">
                        Destination Address:
                    </label>
                    <input
                        type="text"
                        id="to"
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                        placeholder="Enter destination address"
                        className="w-full p-2 border rounded"
                        required
                        disabled={loading}
                    />
                </div>
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
        </div>
    );
};

export default MintTokens;