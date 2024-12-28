'use client'

import React, { useState, ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Upload } from 'lucide-react'
import Footer from '@/components/footer'
import Header from '@/components/header'
const CreateMintPage = () => {
  const [status, setStatus] = useState<string>('')
  const wallet = useWallet()
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
  })
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wallet.connected) {
      setStatus('Please connect your wallet first')
      return
    }
    try {
      setUploading(true)
      setStatus('Creating your Solana token...')
      
      // Simulating token creation process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStatus('Token created successfully!')
      setFormData({
        name: "",
        symbol: "",
        description: "",  
      })
      setFile(undefined)
      setImagePreview(null)
    } catch (error) {
      if (error instanceof Error) {
        setStatus(`Error: ${error.message}`)
      }
    } finally {
      setUploading(false)
    }
  }

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
}

export default CreateMintPage

