"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, PlusCircle, Trash2, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const ticketSchema = z.object({
  name: z.string(),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  price: z.coerce.number().min(0.01, "Price is required"),
});

const eventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventDescription: z.string().min(1, "Description is required"),
  eventDate: z.string().min(1, "Date is required"),
  eventTime: z.string().min(1, "Time is required"),
  eventLocation: z.string().min(1, "Location is required"),
  eventImage: z.any().optional(),
  tickets: z.array(ticketSchema).min(1, "At least one ticket type is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: "",
      eventDescription: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      tickets: [{ name: "Normal", quantity: 100, price: 25 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tickets",
  });

  const progress = (step / 3) * 100;

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      form.setValue('eventImage', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep1 = async () => {
    const isValid = await form.trigger(["eventName", "eventDescription", "eventDate", "eventTime", "eventLocation"]);
    if (isValid) {
      setStep(2);
    } else {
       toast({
        variant: "destructive",
        title: "Missing Details",
        description: "Please fill in all required event details.",
      });
    }
  };

  const handleNextStep2 = async () => {
    const isValid = await form.trigger("tickets");
    if (isValid) {
      setStep(3);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Ticket Info",
        description: "Please ensure all ticket types have a valid quantity and price.",
      });
    }
  };
  
  const eventData = form.watch();

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
        <Form {...form}>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Event Details</CardTitle>
                <CardDescription>Tell us about your event.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Spring Music Fest" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your event in detail..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                  control={form.control}
                  name="eventLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Main Campus Quad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="eventImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Image</FormLabel>
                      <FormControl>
                        <div 
                          className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden"/>
                          {imagePreview ? (
                            <div className="relative w-full h-48">
                              <Image src={imagePreview} alt="Event preview" fill className="rounded-md object-contain" />
                               <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={(e) => { e.stopPropagation(); setImagePreview(null); form.setValue('eventImage', null); if(fileInputRef.current) fileInputRef.current.value = "";}}>
                                  <X className="h-4 w-4"/>
                               </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-muted-foreground mb-2"/>
                              <p className="text-muted-foreground">Drag & drop an image here, or click to select</p>
                              <Button variant="outline" size="sm" className="mt-4 pointer-events-none">Upload Image</Button>
                            </>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                 />
                <Button onClick={handleNextStep1} className="w-full md:w-auto">Next: Ticket Details</Button>
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
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    {fields.length > 1 && (
                       <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-destructive"/>
                       </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <FormField
                         control={form.control}
                         name={`tickets.${index}.name`}
                         render={({ field }) => (
                           <FormItem className="md:col-span-1">
                             <FormLabel>Ticket Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="VIP">VIP</SelectItem>
                                    <SelectItem value="VVIP">VVIP</SelectItem>
                                </SelectContent>
                              </Select>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name={`tickets.${index}.quantity`}
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Quantity</FormLabel>
                             <FormControl>
                               <Input type="number" placeholder="100" {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name={`tickets.${index}.price`}
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Price ($)</FormLabel>
                             <FormControl>
                               <Input type="number" placeholder="50.00" {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={() => append({ name: "Normal", quantity: 1, price: 10 })}>
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  Add Ticket Type
                </Button>
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
                  <Button onClick={handleNextStep2}>Next: Review & Publish</Button>
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
                          <p><strong className="text-foreground">Name:</strong> {eventData.eventName}</p>
                          <p><strong className="text-foreground">Date:</strong> {eventData.eventDate} at {eventData.eventTime}</p>
                          <p><strong className="text-foreground">Location:</strong> {eventData.eventLocation}</p>
                      </div>
                  </div>
                   {imagePreview && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2 font-headline">Event Image</h3>
                      <div className="relative w-full h-48">
                        <Image src={imagePreview} alt="Event preview" fill className="rounded-md object-contain border" />
                      </div>
                    </div>
                  )}
                  <div>
                      <h3 className="font-semibold text-lg mb-2 font-headline">Tickets</h3>
                      <div className="space-y-2">
                          {eventData.tickets.map((ticket, index) => (
                              <div key={index} className="flex justify-between text-sm text-muted-foreground p-3 border rounded-lg bg-secondary/30">
                                  <span>{ticket.name}</span>
                                  <span className="font-mono">{ticket.quantity} x ${Number(ticket.price).toFixed(2)}</span>
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
        </Form>
      </Card>
    </div>
  );
}
