'use client'
import React, { useState, ChangeEvent } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createMint } from '../../../config/solana';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { collection , doc, getDoc,updateDoc, arrayUnion, setDoc} from "firebase/firestore"; 
import { db } from '../../../config/firebase';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"



const Page = () => {
  const [status, setStatus] = useState<string>('');
  const wallet = useWallet();
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);

  const [file, setFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(e.target?.files?.[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return null;
      }
  
      setStatus("Uploading image to IPFS...");
  
      const data = new FormData();
      data.append("file", file);
  
      const pinataJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5MTkwMzM2ZC1hNTYzLTQxNzctYTQwNy1kYWYwN2Y0ZGQ1ODkiLCJlbWFpbCI6ImdvemlsbGFvbnRvbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDU1MDU5NzZmYzZhYzlkZTU0OTYiLCJzY29wZWRLZXlTZWNyZXQiOiIwZjQ2YTU4MzAxNmQwYzdhMGU2NDQwNjQ5YTBhOWQwOWIxOGNjM2Q3NjUzNjBkZjczNmEyNGMzMzUwNzdjYjM3IiwiZXhwIjoxNzcxOTE4MjUxfQ.0hToamRHXT0UnbKb7vv7wAgYIQQaXwnOp5o1yJ-hP0g';
      if (!pinataJwt) {
        throw new Error("🚨 Missing Pinata JWT in environment variables.");
      }
  
      const uploadRequest = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
        },
        body: data,
      });
  
      const response = await uploadRequest.json();
      console.log("Pinata Image Upload Response:", response);
  
      if (!response || !response.IpfsHash) {
        throw new Error("🚨 Failed to upload image to Pinata.");
      }
  
      return `https://ipfs.io/ipfs/${response.IpfsHash}`; // ✅ This will now return ONLY the image CID
    } catch (e) {
      console.error("🚨 Error uploading image:", e);
      setStatus("Error uploading image to IPFS.");
      return null;
    }
  };
  
  
  
  
  

 
  // ✅ Define Metadata Type
type MetadataType = {
  name: string;
  description: string;
  symbol: string;
  image: string;
};

const uploadMetadata = async (metadata: MetadataType) => {
  try {
    console.log("Uploading metadata:", metadata);

    const pinataJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5MTkwMzM2ZC1hNTYzLTQxNzctYTQwNy1kYWYwN2Y0ZGQ1ODkiLCJlbWFpbCI6ImdvemlsbGFvbnRvbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDU1MDU5NzZmYzZhYzlkZTU0OTYiLCJzY29wZWRLZXlTZWNyZXQiOiIwZjQ2YTU4MzAxNmQwYzdhMGU2NDQwNjQ5YTBhOWQwOWIxOGNjM2Q3NjUzNjBkZjczNmEyNGMzMzUwNzdjYjM3IiwiZXhwIjoxNzcxOTE4MjUxfQ.0hToamRHXT0UnbKb7vv7wAgYIQQaXwnOp5o1yJ-hP0g'; // ✅ Use secure env variable
    if (!pinataJwt) {
      throw new Error("🚨 Missing Pinata JWT in environment variables.");
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${pinataJwt}`,
        "Content-Type": "application/json", // ✅ Ensure correct format
      },
      body: JSON.stringify({
        pinataMetadata: { name: metadata.name }, // ✅ Now TypeScript recognizes `name`
        pinataContent: metadata, // ✅ Correctly structured metadata
      }),
    });

    const responseData = await response.json();
    console.log("Pinata Metadata Upload Response:", responseData);

    if (!response.ok) {
      throw new Error(`🚨 Pinata API Error: ${responseData.error || response.statusText}`);
    }

    if (!responseData.IpfsHash) {
      throw new Error("🚨 Failed to retrieve IPFS hash from Pinata.");
    }

    return `https://ipfs.io/ipfs/${responseData.IpfsHash}`; // ✅ Correct IPFS format
  } catch (e) {
    console.error("🚨 Error uploading metadata:", e);
    alert("Trouble uploading metadata to Pinata. Check your API key.");
    return null;
  }
};

  

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!wallet.connected) {
    setStatus('Please connect your wallet first');
    return;
  }

  try {
    setUploading(true);
    setStatus('Uploading image to IPFS...');

    // ✅ Step 1: Upload Image First and get the correct Image CID
    const imageCID = await uploadFile();
    if (!imageCID) {
      setStatus("Error uploading image to IPFS.");
      setUploading(false);
      return;
    }

    console.log("✅ Image IPFS CID:", imageCID); // Debugging

    // ✅ Step 2: Create Metadata JSON with correct image CID
    const metadata = {
      name: formData.name,
      description: formData.description,
      symbol: formData.symbol,
      image: imageCID, // ✅ Now it correctly stores the direct image IPFS CID
    };

    console.log("✅ Metadata before upload:", metadata);
    setStatus('Uploading metadata to IPFS...');

    // ✅ Step 3: Upload Metadata JSON to IPFS
    const metadataCID = await uploadMetadata(metadata);
    if (!metadataCID) {
      setStatus("Error uploading metadata to IPFS.");
      setUploading(false);
      return;
    }

    console.log("✅ Metadata IPFS URI:", metadataCID);

    const userAddress = wallet.publicKey?.toBase58();

    setStatus('Creating Solana token...');
    const token = await createMint(metadata, wallet, metadataCID);

    console.log("✅ Token created:", token);

    const userDocRef = doc(collection(db, "tokens"), userAddress);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      await updateDoc(userDocRef, {
        tokens: arrayUnion(token),
      });
      setStatus('Token added to your existing record!');
    } else {
      await setDoc(userDocRef, {
        userAddress: userAddress,
        tokens: [token],
      });
      setStatus('New token record created for user!');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("🚨 Error:", error.message);
      setStatus(`Error: ${error.message}`);
    } else {
      console.error("🚨 Unknown error:", error);
      setStatus("An unexpected error occurred.");
    }
  } finally {
    setUploading(false);
  }
};




  

  return (
    <div className="flex flex-col min-h-screen">
    <Header />  
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create Solana Token</CardTitle>
          <CardDescription>Fill in the details to create your custom Solana token</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter token name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                placeholder="Enter token symbol"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your token"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Token Image</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Image
                </Button>
                {imagePreview && (
                  <img src={imagePreview} alt="Token Preview" className="h-16 w-16 object-cover rounded-full" />
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!wallet.connected || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Token...
              </>
            ) : wallet.connected ? (
              'Create Token'
            ) : (
              'Connect Wallet First'
            )}
          </Button>
        </CardFooter>
      </Card>
      {status && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <Alert variant={status.includes('Error') ? 'destructive' : 'default'}>
            <AlertTitle>{status.includes('Error') ? 'Error' : 'Status Update'}</AlertTitle>
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
    <Footer />
  </div>
  )
};

export default Page;
