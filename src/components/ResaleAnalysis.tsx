"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getResaleAnalysis } from '@/app/actions';
import { type AnalyzeTicketResaleOutput } from '@/ai/flows/ticket-resale-analyzer';
import { type MockEvent, mockResaleTickets } from '@/lib/mock-data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowDown, ArrowUp, BadgeDollarSign, BarChart, BrainCircuit, LineChart, Loader2, Sparkles } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const resaleSchema = z.object({
  resalePrice: z.coerce.number().min(1, 'Price must be greater than 0'),
});

type ResaleFormValues = z.infer<typeof resaleSchema>;

type ResaleAnalysisProps = {
  event: MockEvent;
};

export default function ResaleAnalysis({ event }: ResaleAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeTicketResaleOutput | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ResaleFormValues>({
    resolver: zodResolver(resaleSchema),
    defaultValues: { resalePrice: mockResaleTickets[0]?.resalePrice || event.priceRange.min * 1.2 },
  });
  
  const onSubmit: SubmitHandler<ResaleFormValues> = async (data) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await getResaleAnalysis({
        eventDescription: event.description,
        originalPrice: event.priceRange.min,
        resalePrice: data.resalePrice,
        currentDemand: "High demand due to limited tickets and popular headliners.",
        venueDetails: `The event is at ${event.location}, a venue with a capacity of 5,000.`,
      });
      setAnalysis(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not get resale analysis. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-primary"/> AI-Powered Resale Market</CardTitle>
        <CardDescription>See what other fans are charging and get an AI-powered price analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
             {mockResaleTickets.map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between p-3 rounded-md border bg-secondary/30">
                <div>
                  <p className="font-semibold text-sm">Seller: {ticket.sellerName}</p>
                  <p className="text-xs text-muted-foreground">Original Price: ${ticket.originalPrice.toFixed(2)}</p>
                </div>
                <Link href="#">
                  <Button variant="secondary" size="sm">
                    Buy for ${ticket.resalePrice.toFixed(2)}
                  </Button>
                </Link>
              </div>
            ))}
        </div>

        <div className="p-4 border-2 border-dashed rounded-lg">
            <h3 className="font-headline text-lg mb-2 flex items-center gap-2"><BrainCircuit className="text-accent" />Resale Ticket Analyzer</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Thinking of reselling a ticket? Enter a price to get an AI-powered analysis on its market viability.
            </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
              <FormField
                control={form.control}
                name="resalePrice"
                render={({ field }) => (
                  <FormItem className="flex-grow w-full sm:w-auto">
                    <FormLabel>Your Resale Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <BadgeDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="number" step="0.01" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full sm:w-auto self-end">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Price
              </Button>
            </form>
          </Form>

          {loading && (
            <div className="text-center p-8">
              <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin" />
              <p className="mt-2 text-muted-foreground">AI is analyzing the market...</p>
            </div>
          )}

          {analysis && (
            <Alert className="mt-6 border-accent">
                <Sparkles className="h-4 w-4 !text-accent" />
              <AlertTitle className="font-headline text-accent">AI Analysis Complete</AlertTitle>
              <AlertDescription className="mt-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-background">
                        <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium flex items-center text-muted-foreground"><LineChart className="mr-2"/> Fair Price Estimate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-accent">${analysis.fairPriceEstimate.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-background">
                        <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
                               {analysis.potentialProfit >= 0 ? <ArrowUp className="mr-2 text-green-500"/> : <ArrowDown className="mr-2 text-red-500" />}
                               Potential Profit
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold ${analysis.potentialProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>${analysis.potentialProfit.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold flex items-center text-foreground"><BarChart className="mr-2 h-4 w-4 text-muted-foreground"/> Market Sentiment</h4>
                    <p className="text-sm text-muted-foreground">{analysis.marketSentiment}</p>
                </div>
                 <div className="space-y-2">
                    <h4 className="font-semibold flex items-center text-foreground"><BarChart className="mr-2 h-4 w-4 text-muted-foreground"/> Risk Assessment</h4>
                    <p className="text-sm text-muted-foreground">{analysis.riskAssessment}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

        </div>
      </CardContent>
    </Card>
  );
}
