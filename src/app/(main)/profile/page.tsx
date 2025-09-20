"use client";

import { useState } from "react";
import { mockUser, mockResaleTickets, mockEvents } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saving:", { name, email });
    // For now, we'll just update the mock data reference in the state
    mockUser.name = name;
    mockUser.email = email;
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(mockUser.name);
    setEmail(mockUser.email);
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <div className="bg-secondary/50 h-32" />
        <CardContent className="p-6 text-center -mt-20">
          <Avatar className="w-32 h-32 mx-auto border-4 border-background shadow-lg">
            <AvatarImage src={mockUser.avatarUrl} alt={name} />
            <AvatarFallback className="text-4xl">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          {!isEditing ? (
            <>
              <h1 className="text-3xl font-headline mt-4">{name}</h1>
              <p className="text-muted-foreground">{email}</p>
            </>
          ) : (
            <div className="mt-4 max-w-sm mx-auto space-y-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold">{mockUser.reputationScore}</span>
            <span className="text-sm text-muted-foreground">Reputation</span>
          </div>

          <div className="mt-4 space-x-2">
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Active Ticket Listings
          </CardTitle>
          <CardDescription>Tickets you are currently selling on the resale market.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockResaleTickets.slice(0, 2).map(ticket => {
              const event = mockEvents.find(e => e.id === ticket.eventId);
              return (
                <div key={ticket.id} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-colors">
                  <div>
                    <p className="font-bold">{event?.title}</p>
                    <p className="text-sm text-muted-foreground">Original: ${ticket.originalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <Badge variant="secondary" className="text-base">
                      Your Price: ${ticket.resalePrice.toFixed(2)}
                    </Badge>
                    <Link href={`/event/${event?.id}`}>
                      <Button variant="outline">View Listing</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
             {mockResaleTickets.length === 0 && (
                <p className="text-center text-muted-foreground py-4">You have no active listings.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
