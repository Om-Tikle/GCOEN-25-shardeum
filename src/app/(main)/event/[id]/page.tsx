"use client";

import Image from "next/image";
import { mockEvents, mockTickets, mockResaleTickets, mockReviews, type MockTicket, type MockNftTicket } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tag, Calendar, Clock, MapPin, Star, Ticket, Users } from "lucide-react";
import ResaleAnalysis from "@/components/ResaleAnalysis";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = mockEvents.find(e => e.id === params.id) || mockEvents[0];
  const heroImage = PlaceHolderImages.find(img => img.id === 'event-hero');
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const handleBuyTicket = (ticket: MockTicket) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Logged In",
            description: "You need to be logged in to purchase tickets.",
        });
        return;
    }
    
    if (user.campusCredits < ticket.price) {
         toast({
            variant: "destructive",
            title: "Insufficient Credits",
            description: "You don't have enough Campus Credits to buy this ticket.",
        });
        return;
    }

    // Deduct credits and add new NFT ticket
    const newNftTicket: MockNftTicket = {
        id: `nft-${Date.now()}`,
        eventName: event.title,
        ticketType: ticket.name,
        eventDate: event.date,
        location: event.location,
        imageId: 'ticket-nft-1' // You could randomize this or base it on event
    };

    setUser(currentUser => {
        if (!currentUser) return null;
        return {
            ...currentUser,
            campusCredits: currentUser.campusCredits - ticket.price,
            nftTickets: [...currentUser.nftTickets, newNftTicket]
        }
    });

    toast({
        title: "Purchase Successful!",
        description: `Your ${ticket.name} for ${event.title} is now in your wallet.`,
    });

    router.push('/wallet');
  };


  return (
    <div>
      <div className="relative h-48 md:h-64 w-full">
        {heroImage && 
          <Image
            src={heroImage.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto -mt-16 relative">
        <div className="bg-card p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2">{event.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground font-body">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</div>
            <div className="flex items-center gap-2"><Tag className="h-4 w-4" /> {event.category}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle className="font-headline">About this event</CardTitle></CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="font-headline flex items-center gap-2"><Ticket className="text-primary"/> Official Tickets</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {mockTickets.map(ticket => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 rounded-md border bg-background hover:bg-secondary/50 transition-colors">
                    <div>
                      <h3 className="font-bold">{ticket.name}</h3>
                      <p className="text-sm text-muted-foreground">{ticket.quantity} remaining</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">${ticket.price.toFixed(2)}</p>
                      <Button size="sm" className="mt-1" onClick={() => handleBuyTicket(ticket)}>Buy Now</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <ResaleAnalysis event={event} />

          </div>
          <div className="space-y-8">
             <Card>
              <CardHeader><CardTitle className="font-headline flex items-center gap-2"><Users className="text-primary" /> Community Reviews</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {mockReviews.map((review, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-3">
                       <Avatar>
                         <AvatarImage src={review.avatarUrl} />
                         <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div>
                         <p className="font-semibold">{review.name}</p>
                         <div className="flex items-center gap-0.5">
                           {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />)}
                         </div>
                       </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                    {index < mockReviews.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
