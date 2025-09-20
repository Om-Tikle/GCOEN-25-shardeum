"use client";

import { useState } from 'react';
import { ethers } from "ethers";
import { mockUser, mockTransactions, mockNftTickets, type MockTransaction } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowDownLeft, ArrowUpRight, Coins, Plus, Loader2 } from "lucide-react";
import NftTicketCard from "@/components/NftTicketCard";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function WalletPage() {
  const { toast } = useToast();
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [addAmount, setAddAmount] = useState('0.01');
  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [user, setUser] = useState(mockUser);
  const [transactions, setTransactions] = useState(mockTransactions);

  const handleAddFunds = async () => {
    setIsAddingFunds(true);
    if (typeof window.ethereum === 'undefined') {
      toast({
        variant: "destructive",
        title: "Wallet Not Found",
        description: "Please install a wallet extension like MetaMask.",
      });
      setIsAddingFunds(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: "0x000000000000000000000000000000000000dEaD", // Placeholder address
        value: ethers.parseEther(addAmount)
      });
      
      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash.substring(0, 10)}...`,
      });

      await tx.wait();
      
      const ethAmount = parseFloat(addAmount);
      const creditsToAdd = Math.floor(ethAmount * 10000); // 1 ETH = 10,000 credits
      const dollarValue = creditsToAdd * 0.1;

      setUser(currentUser => ({
          ...currentUser,
          campusCredits: currentUser.campusCredits + creditsToAdd
      }));

      const newTransaction: MockTransaction = {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString(),
          description: 'Campus Credits Deposit',
          amount: dollarValue,
          type: 'credit'
      };

      setTransactions(currentTransactions => [newTransaction, ...currentTransactions]);


      toast({
        title: "Transaction Confirmed",
        description: `${creditsToAdd} Campus Credits have been added to your account.`,
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "An error occurred while sending the transaction.",
      });
    } finally {
      setIsAddingFunds(false);
      // Close the dialog after handling everything.
      document.getElementById('close-add-funds-dialog')?.click();
    }
  };

  const handleWithdrawFunds = async () => {
    setIsWithdrawing(true);
    const creditsToWithdraw = parseInt(withdrawAmount, 10);

    if (isNaN(creditsToWithdraw) || creditsToWithdraw <= 0) {
        toast({
            variant: "destructive",
            title: "Invalid Amount",
            description: "Please enter a valid number of credits to withdraw.",
        });
        setIsWithdrawing(false);
        return;
    }

    if (creditsToWithdraw > user.campusCredits) {
        toast({
            variant: "destructive",
            title: "Insufficient Balance",
            description: "You cannot withdraw more credits than you have.",
        });
        setIsWithdrawing(false);
        return;
    }
    
    // In a real application, this would trigger a backend process to send crypto
    // For this simulation, we'll just update the UI and show a success message.
    try {
        // Simulate a delay for the transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const dollarValue = creditsToWithdraw * 0.1;

        setUser(currentUser => ({
            ...currentUser,
            campusCredits: currentUser.campusCredits - creditsToWithdraw,
        }));

        const newTransaction: MockTransaction = {
            id: `tx-${Date.now()}`,
            date: new Date().toISOString(),
            description: 'Cash Withdrawal',
            amount: dollarValue,
            type: 'debit',
        };

        setTransactions(currentTransactions => [newTransaction, ...currentTransactions]);
        
        toast({
            title: "Withdrawal Processed",
            description: `${creditsToWithdraw} credits have been converted and sent to your wallet.`,
        });

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Withdrawal Failed",
            description: "An unexpected error occurred.",
        });
    } finally {
        setIsWithdrawing(false);
        document.getElementById('close-withdraw-dialog')?.click();
    }
  };


  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline text-foreground">My Wallet</h1>
        <p className="text-muted-foreground mt-1">Your Campus Credits, tickets, and activity.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Campus Credits Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Coins className="h-8 w-8" />
                <p className="text-5xl font-bold">{user.campusCredits.toLocaleString()}</p>
              </div>
              <p className="mt-1 opacity-80">Equivalent to ${(user.campusCredits * 0.1).toFixed(2)}</p>
              <div className="flex gap-2 mt-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary" className="w-full"><Plus className="mr-2 h-4 w-4" /> Add Funds</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add Funds with MetaMask</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the amount of ETH you'd like to convert to Campus Credits. This will open a MetaMask transaction prompt. (1 ETH = 10,000 Credits)
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Label htmlFor="add-amount" className="text-right">
                        Amount (ETH)
                      </Label>
                      <Input
                        id="add-amount"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className="col-span-3"
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel id="close-add-funds-dialog">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAddFunds} disabled={isAddingFunds}>
                        {isAddingFunds ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Proceed
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="w-full border border-primary-foreground/20 hover:bg-primary-foreground/10">Convert to Cash</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Convert Credits to Cash</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the amount of Campus Credits to withdraw. The equivalent value will be sent to your connected wallet. (100 Credits = $10.00)
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Label htmlFor="withdraw-amount" className="text-right">
                        Credits to Withdraw
                      </Label>
                      <Input
                        id="withdraw-amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="col-span-3"
                        type="number"
                        step="10"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel id="close-withdraw-dialog">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleWithdrawFunds} disabled={isWithdrawing}>
                        {isWithdrawing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Withdraw
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {transactions.map((tx, index) => (
                <div key={tx.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-secondary ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold">{tx.description}</p>
                        <p className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'credit' ? '+' : '-'} ${tx.amount.toFixed(2)}
                    </p>
                  </div>
                  {index < transactions.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">My NFT Tickets</CardTitle>
              <CardDescription>Your collection of verified event tickets.</CardDescription>
            </CardHeader>
            <CardContent>
              {mockNftTickets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mockNftTickets.map(ticket => (
                    <NftTicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">You don't have any tickets yet.</p>
                  <Button variant="link" className="text-primary">Explore Events</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
