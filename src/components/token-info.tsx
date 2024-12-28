import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Coins, Users, Activity, Info } from 'lucide-react';

const TokenInfoSection = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Token Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This token follows Solana&#39;s SPL Token standard, ensuring compatibility
              with wallets and exchanges. All minting operations are secured through
              on-chain verification.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Token Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Minted tokens can be used for transfers, trading, and other DeFi activities
              within the Solana ecosystem. Each transaction is processed with minimal fees.
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Info className="mr-2 h-5 w-5 text-primary" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Coins className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Token Supply</h4>
                <p className="text-sm text-muted-foreground">
                  Mint new tokens as needed. Each minting operation requires proper
                  authorization and will be recorded on the Solana blockchain.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Token Distribution</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure proper token distribution by specifying the correct recipient
                  address. Double-check all addresses before minting to avoid errors.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenInfoSection;
