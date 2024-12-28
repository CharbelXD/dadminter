import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Wallet, Network, Coins } from 'lucide-react';

const DevnetInfoSection = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Network className="mr-2 h-5 w-5 text-primary" />
              About Devnet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Solana Devnet is a test network designed for developers to experiment
              and build applications without using real tokens. It&#39;s perfect for
              testing and development purposes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-primary" />
              Token Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Devnet SOL tokens have no monetary value and cannot be transferred to
              mainnet. They are solely for testing smart contracts, DApps, and
              other blockchain features.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-primary" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Coins className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Airdrop Limits</h4>
                <p className="text-sm text-muted-foreground">
                  Each airdrop provides 1 Devnet SOL. There are rate limits in place
                  to prevent abuse. Wait a few seconds between requests if you need
                  multiple airdrops.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevnetInfoSection;
