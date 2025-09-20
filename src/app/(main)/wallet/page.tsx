import { mockUser, mockTransactions, mockNftTickets } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowDownLeft, ArrowUpRight, Coins, Plus } from "lucide-react";
import NftTicketCard from "@/components/NftTicketCard";

export default function WalletPage() {
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
                <p className="text-5xl font-bold">{mockUser.campusCredits.toLocaleString()}</p>
              </div>
              <p className="mt-1 opacity-80">Equivalent to ${(mockUser.campusCredits * 0.1).toFixed(2)}</p>
              <div className="flex gap-2 mt-6">
                <Button variant="secondary" className="w-full"><Plus className="mr-2 h-4 w-4" /> Add Funds</Button>
                <Button variant="ghost" className="w-full border border-primary-foreground/20 hover:bg-primary-foreground/10">Convert to Cash</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTransactions.map((tx, index) => (
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
                  {index < mockTransactions.length - 1 && <Separator className="my-3" />}
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
