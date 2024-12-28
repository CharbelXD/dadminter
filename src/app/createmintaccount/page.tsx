'use client'
import React, { useState, ChangeEvent } from 'react';
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { createMint } from '../../../config/solana';

interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image?: File;
}

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
  const [url, setUrl] = useState<string>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);



  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

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
        return;
      }

      const data = new FormData();
      data.set("file", file, formData.name);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      setUrl(signedUrl);
      return signedUrl;
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

 
  const uploadMetadata = async (metadata: object) => {
    try {
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });

      const metadataFormData = new FormData();
      metadataFormData.set(
        "file",
        metadataBlob,
        `metadata-${formData.name}.json`
      );

      const metadataUploadRequest = await fetch("/api/files", {
        method: "POST",
        body: metadataFormData,
      });

      if (!metadataUploadRequest.ok)
        throw new Error("Failed to upload metadata");

      alert("Metadata uploaded successfully!");
      return metadataUploadRequest.json();
    } catch (e) {
      console.error("Error uploading metadata:", e);
      alert("Trouble uploading metadata");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected) {
      setStatus('Please connect your wallet first');
      return;
    }
    try{

    setUploading(true);
    setStatus('Uploading image to IPFS...');

    const imageURL = await uploadFile();
    if (imageURL) {
      const metadata = {
        name: formData.name,
        description: formData.description,
        symbol: formData.symbol,
        image: imageURL,
      };

      const response = await uploadMetadata(metadata);
      console.log("Metadata response:", response);
      const token = await createMint(
        metadata,
        wallet,
        response
      );

      setUploading(false);
      setFormData({
        name: "",
        symbol: "",
        description: "",  
      });
    }}
    catch (error) {
      if (error instanceof Error) {
        setStatus(`Error: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
    
  };


  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Solana Token</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Token Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Symbol</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Token Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={!wallet.connected || uploading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {uploading ? 'Processing...' : wallet.connected ? 'Create Token' : 'Connect Wallet First'}
        </button>
      </form>

      {status && (
        <div className="mt-4 p-4 rounded bg-gray-100">
          <p>{status}</p>
        </div>
      )}
    </div>
  );
};

export default Page;