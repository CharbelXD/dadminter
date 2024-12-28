'use client'
import React, { useState } from 'react';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount } from '../../../../config/solana';
import { useWallet } from '@solana/wallet-adapter-react';

const TokenAccountForm = () => {
  const [ownerAddress, setOwnerAddress] = useState('');
  const [status, setStatus] = useState('');
  const [accountAddress, setAccountAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const wallet = useWallet();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');
    setAccountAddress('');

    try {
      const ownerPubkey = new PublicKey(ownerAddress);
      setStatus('Creating/fetching associated token account...');

      const account = await getOrCreateAssociatedTokenAccount(
        wallet,
        ownerPubkey
      );


      setAccountAddress(account.address.toBase58());
      setStatus('Success! Associated token account created/fetched.');

    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Associated Token Account</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Owner Address:
            <input
              type="text"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white sm:text-sm"
              placeholder="Enter owner address"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading  || !ownerAddress}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Create/Get Token Account'}
        </button>
      </form>

      {status && (
        <div className={`mt-6 p-4 rounded-md ${status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          <p className="text-sm font-medium">{status}</p>
          {accountAddress && (
            <div className="mt-2">
              <p className="text-sm font-medium">Token Account Address:</p>
              <code className="block mt-1 p-2 bg-gray-100 rounded text-sm break-all">
                {accountAddress}
              </code>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <h2 className="font-medium text-gray-700 mb-2">Note:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Make sure you have enough SOL in your wallet to create the token account</li>
          <li>The mint address should be a valid Solana token mint</li>
          <li>The owner address should be a valid Solana wallet address</li>
        </ul>
      </div>
    </div>
  );
};

export default TokenAccountForm;