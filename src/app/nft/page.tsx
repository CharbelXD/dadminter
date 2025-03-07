"use client";
import { useState, ChangeEvent } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../../config/firebase";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/header";
import Footer from "@/components/footer";

// ✅ Use a reliable RPC provider
const connection = new Connection("https://little-capable-dream.solana-mainnet.quiknode.pro/d3c1f6637adf56f528716f4ce5c34e177bb24db6/", "confirmed");
const metaplex = Metaplex.make(connection);

const PINATA_API_KEY = "c703619539defb5108e3";
const PINATA_SECRET_KEY = "25e0320637e6aad5474892320e0f39599defc2544c410cab394043a0e8b9fb1c";

const db = getFirestore(app);



// ✅ Validate Metadata URI before minting






const NFTMinter = () => {
  const wallet = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
      setImagePreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const uploadImageToPinata = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: formData,
    });

    const result = await response.json();
    if (!result.IpfsHash) throw new Error("Failed to upload image to Pinata.");
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  };

  const uploadMetadataToPinata = async (metadata: object): Promise<string> => {
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: JSON.stringify(metadata),
    });

    const result = await response.json();
    if (!result.IpfsHash) throw new Error("Failed to upload metadata to Pinata.");
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  };

  const mintNFT = async (metadataUri: string, nftName: string, nftSymbol: string) => {
    if (!wallet.publicKey) {
      throw new Error("Wallet not connected.");
    }

    metaplex.use(walletAdapterIdentity(wallet));

    const { nft } = await metaplex
      .nfts()
      .create({
        uri: metadataUri,
        name: nftName,
        symbol: nftSymbol.substring(0, 10), // ✅ Ensure symbol is ≤ 10 characters
        sellerFeeBasisPoints: 500,
        isMutable: true,
      });

    return nft;
  };

  const checkBalance = async () => {
    if (!wallet.publicKey) {
      alert("Wallet not connected. Please connect your wallet.");
      return false;
    }
  
    const balance = await connection.getBalance(wallet.publicKey);
    if (balance < 0.01 * 10 ** 9) {
      alert("Insufficient SOL! Add funds to your wallet.");
      return false;
    }
  
    return true;
  };
  



  

  const DEV_WALLET_ADDRESS = "RoyUSr7Av36ovVo52df44Humg1c9Mi3ULhjVanTtJN5"; // 🔹 Replace with your actual wallet

const sendPayment = async () => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet not connected.");
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey, // User's wallet
      toPubkey: new PublicKey(DEV_WALLET_ADDRESS), // Dev wallet
      lamports: 0.01 * 10 ** 9, // 0.01 SOL in lamports
    })
  );

  try {
    setMessage("Processing payment... Please approve in your wallet.");
    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");

    console.log("✅ Payment successful:", signature);
    setMessage("✅ Payment received! Minting NFT...");
    return true;
  } catch (error) {
    console.error("🚨 Payment failed:", error);
    setMessage("🚨 Payment failed. Please try again.");
    return false;
  }
};




const handleMint = async () => {
  setMessage("");

  const hasEnoughSOL = await checkBalance();
if (!hasEnoughSOL) {
  setMessage("🚨 Insufficient SOL! Please add funds.");
  return;
}

  if (!wallet.connected || !wallet.publicKey) {
    setMessage("Please connect your wallet.");
    return;
  }

  if (!name || !symbol || !description || !imageFile) {
    setMessage("Please fill in all fields and upload an image.");
    return;
  }

  if (symbol.length > 10) {
    setMessage("NFT symbol must be 10 characters or less.");
    return;
  }

  const trimmedSymbol = symbol.substring(0, 10);
  let imageUri = "";
  let metadataUri = "";
  let nft;

  try {
    // 🔹 Step 1: Charge the user 0.01 SOL
    const paymentSuccess = await sendPayment();
    if (!paymentSuccess) return; // ❌ Stop if payment fails

    // 🔹 Step 2: Upload Image to Pinata
    setMinting(true);
    setMessage("Uploading image to Pinata...");
    imageUri = await uploadImageToPinata(imageFile);

    // 🔹 Step 3: Upload Metadata to Pinata
    setMessage("Uploading metadata to Pinata...");
    metadataUri = await uploadMetadataToPinata({ name, symbol: trimmedSymbol, description, image: imageUri });

    console.log("Metadata URI:", metadataUri);

    // 🔹 Step 4: Mint NFT
    setMessage("Minting NFT...");
    nft = await mintNFT(metadataUri, name, trimmedSymbol);

    setMessage(`🎉 NFT Minted! Mint Address: ${nft.address.toBase58()}`);

    // 🔹 Step 5: Save to Firestore
    await addDoc(collection(db, "nfts"), {
      name,
      symbol: trimmedSymbol,
      description,
      image: imageUri,
      metadataUri,
      mintAddress: nft.address.toBase58(),
      timestamp: new Date(),
    });

    console.log("✅ NFT saved to Firestore!");
  } catch (error) {
    console.error("🚨 Minting error:", error);
    setMessage("🚨 Minting failed. Check console for details.");
  } finally {
    setMinting(false);
  }
};

  
  

  

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <motion.div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create Solana NFT</CardTitle>
            <CardDescription>Fill in the details to create your custom Solana NFT</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <Label htmlFor="name">NFT Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Label htmlFor="symbol">Symbol</Label>
              <Input id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />

              <Label htmlFor="image">NFT Image</Label>
              <div className="flex items-center space-x-4">
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Button type="button" variant="outline" onClick={() => document.getElementById("image")?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Image
                </Button>
                {imagePreview && <img src={imagePreview} alt="NFT Preview" className="h-16 w-16 object-cover rounded-full" />}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {message && (
              <Alert variant={message.includes("failed") ? "destructive" : "default"}>
                <AlertTitle>{message.includes("failed") ? "Error" : "Success"}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleMint} disabled={minting}>
              {minting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create NFT"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <Footer />
    </div>
  );
};

export default NFTMinter;
