'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '../../../config/firebase';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { getTokenMetadata } from '@solana/spl-token';
import { useRouter } from 'next/navigation';

interface TokenMetadata {
  name: string;
  symbol: string;
  image: string;
  mintAddress: string;
}

const Page = () => {
  const wallet = useWallet();
  const router = useRouter();
  const [tokens, setTokens] = useState<string[]>([]);
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  const handleMint = (mintAddress: string) => {
    router.push(`/tokens/${mintAddress}`);
  };

  const fetchMetadataFromUri = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      console.error('Error fetching metadata from URI:', error);
      return null;
    }
  };

  const fetchMetadata = async (mintAddress: string) => {
    try {
      const mintPubkey = new PublicKey(mintAddress);
      const metadata = await getTokenMetadata(
        connection,
        mintPubkey,
        'confirmed',
        TOKEN_2022_PROGRAM_ID,
      );
      
      console.log('Initial metadata:', metadata);
      
      if (metadata && metadata.uri) {
        // Fetch the actual metadata from the URI
        const fullMetadata = await fetchMetadataFromUri(metadata.uri);
        console.log('Full metadata:', fullMetadata);
        
        if (fullMetadata) {
          return {
            name: metadata.name || 'Unknown',
            symbol: metadata.symbol || 'Unknown',
            image: fullMetadata.image || '/api/placeholder/200/200',
            mintAddress
          };
        }
      }
      
      // Fallback if no URI metadata
      return {
        name: metadata?.name || 'Unknown',
        symbol: metadata?.symbol || 'Unknown',
        image: '/api/placeholder/200/200',
        mintAddress
      };
    } catch (error) {
      console.error('Error fetching metadata for token:', mintAddress, error);
      return {
        name: 'Unknown Token',
        symbol: 'Unknown',
        image: '/api/placeholder/200/200',
        mintAddress
      };
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      if (!wallet.publicKey) {
        setLoading(false);
        return;
      }

      try {
        const userAddress = wallet.publicKey.toBase58();
        const userDocRef = doc(db, 'tokens', userAddress);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setTokens(userData.tokens || []);

          // Fetch metadata for all tokens
          const metadataPromises = userData.tokens.map(fetchMetadata);
          const metadata = await Promise.all(metadataPromises);
          setTokenMetadata(metadata.filter(m => m != null));
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [wallet.publicKey]);

  if (!wallet.publicKey) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Please connect your wallet</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Loading tokens...</h1>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Token Collection</h1>
      {tokenMetadata.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokenMetadata.map((token) => (
            <Card key={token.mintAddress} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">{token.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Symbol: {token.symbol}</p>
                  <p className="text-sm text-gray-600 truncate">
                    Mint: {token.mintAddress}
                  </p>
                  <button 
                    onClick={() => handleMint(token.mintAddress)}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Mint Some Tokens
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No tokens found in your collection.</p>
      )}
    </div>
  );
};

export default Page;