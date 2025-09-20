"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, PlusCircle, Trash2, Upload } from "lucide-react";

type TicketType = {
  id: number;
  name: string;
  quantity: string;
  price: string;
};

export default function CreateEventPage() {
  const [step, setStep] = useState(1);
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: 1, name: "General Admission", quantity: "100", price: "25" },
  ]);

  const progress = (step / 3) * 100;

  const addTicketType = () => {
    setTickets([...tickets, { id: Date.now(), name: "", quantity: "", price: "" }]);
  };

  const removeTicketType = (id: number) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline text-foreground">Create New Event</h1>
        <p className="text-muted-foreground mt-1">Bring your campus together with a new experience.</p>
      </header>
      
      <div className="mb-8">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">Step {step} of 3</p>
      </div>

      <Card>
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Event Details</CardTitle>
              <CardDescription>Tell us about your event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input id="eventName" placeholder="e.g. Spring Music Fest" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDescription">Description</Label>
                <Textarea id="eventDescription" placeholder="Describe your event in detail..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Date</Label>
                  <Input id="eventDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Time</Label>
                  <Input id="eventTime" type="time" />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="eventLocation">Location</Label>
                <Input id="eventLocation" placeholder="e.g. Main Campus Quad" />
              </div>
               <div className="space-y-2">
                <Label>Event Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2"/>
                    <p className="text-muted-foreground">Drag & drop an image here, or click to select</p>
                    <Button variant="outline" size="sm" className="mt-4">Upload Image</Button>
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full md:w-auto">Next: Ticket Details</Button>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Ticket Details</CardTitle>
              <CardDescription>Define the tickets for your event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tickets.map((ticket, index) => (
                <div key={ticket.id} className="p-4 border rounded-lg space-y-4 relative">
                  {tickets.length > 1 && (
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeTicketType(ticket.id)}>
                        <Trash2 className="h-4 w-4 text-destructive"/>
                     </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2 md:col-span-1">
                        <Label htmlFor={`ticketName-${index}`}>Ticket Name</Label>
                        <Input id={`ticketName-${index}`} placeholder="e.g. VIP Access" defaultValue={ticket.name}/>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor={`ticketQuantity-${index}`}>Quantity</Label>
                        <Input id={`ticketQuantity-${index}`} type="number" placeholder="100" defaultValue={ticket.quantity}/>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor={`ticketPrice-${index}`}>Price ($)</Label>
                        <Input id={`ticketPrice-${index}`} type="number" placeholder="50.00" defaultValue={ticket.price}/>
                     </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addTicketType}>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add Ticket Type
              </Button>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
                <Button onClick={() => setStep(3)}>Next: Review & Publish</Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 3 && (
            <>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Review & Publish</CardTitle>
              <CardDescription>Review your event details before making it public.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2 font-headline">Event Summary</h3>
                    <div className="space-y-1 text-sm text-muted-foreground p-4 border rounded-lg bg-secondary/30">
                        <p><strong className="text-foreground">Name:</strong> Spring Music Fest</p>
                        <p><strong className="text-foreground">Date:</strong> May 15, 2024 at 7:00 PM</p>
                        <p><strong className="text-foreground">Location:</strong> Main Campus Quad</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2 font-headline">Tickets</h3>
                    <div className="space-y-2">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="flex justify-between text-sm text-muted-foreground p-3 border rounded-lg bg-secondary/30">
                                <span>{ticket.name || 'General Admission'}</span>
                                <span className="font-mono">{ticket.quantity || 100} x ${parseFloat(ticket.price || '25').toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
                <Button onClick={() => alert("Event Published!")} className="bg-green-600 hover:bg-green-700">Publish Event</Button>
              </div>
            </CardContent>
            </>
        )}
      </Card>
    </div>
  );
}
