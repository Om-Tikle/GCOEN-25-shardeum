"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CampusConnectLogo } from "@/components/icons";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  
  const handleConnectWallet = async () => {
    setError(null);
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // It requests the user to authorize the connection
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        toast({
          title: "Wallet Connected",
          description: `Connected with address: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        });

        // Redirect to home page after successful connection
        router.push('/home');
        
      } catch (err: any) {
        setError(err.message || "An error occurred while connecting the wallet.");
        toast({
            variant: "destructive",
            title: "Connection Failed",
            description: "Could not connect to the wallet. Please try again.",
        });
      }
    } else {
      setError("MetaMask is not installed. Please install it to connect your wallet.");
      toast({
        variant: "destructive",
        title: "Wallet Not Found",
        description: "Please install a wallet extension like MetaMask.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <CampusConnectLogo className="h-20 w-20 text-primary" />
          <h1 className="mt-4 text-4xl font-headline text-foreground">CampusConnect</h1>
          <p className="text-muted-foreground font-body">Your verified gateway to campus events.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
             {error && (
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Link href="/home" className="w-full">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </Link>
              <Button variant="outline" className="w-full" type="button" onClick={handleConnectWallet}>
                <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
