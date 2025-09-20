"use client";

import EventCard from "@/components/EventCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockEvents } from "@/lib/mock-data";
import { Coins, Wallet } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function HomePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        
        toast({
          title: "Wallet Connected",
          description: `Connected with address: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        });
        
      } catch (err: any) {
        toast({
            variant: "destructive",
            title: "Connection Failed",
            description: "Could not connect to the wallet. Please try again.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Wallet Not Found",
        description: "Please install a wallet extension like MetaMask.",
      });
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline text-foreground">
            Hello, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">Welcome back to CampusConnect.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-lg text-primary">{user.campusCredits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Campus Credits</p>
          </div>
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <section className="sm:hidden mb-6">
          <div className="p-4 rounded-lg border bg-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Campus Credits</p>
              <p className="font-bold text-2xl text-primary">{user.campusCredits.toLocaleString()}</p>
            </div>
            <Coins className="h-8 w-8 text-primary/70" />
          </div>
      </section>

      <section className="mb-8">
        {!walletAddress ? (
            <Button onClick={handleConnectWallet} variant="outline" className="w-full md:w-auto">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet to Get Started
            </Button>
        ) : (
             <div className="p-4 rounded-lg border bg-card text-center">
                <p className="text-sm text-muted-foreground">Wallet Connected</p>
                <p className="font-mono text-sm font-bold text-primary truncate">{walletAddress}</p>
             </div>
        )}
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-headline mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
