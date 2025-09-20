'use server';
/**
 * @fileOverview AI-powered ticket resale insights.
 *
 * - analyzeTicketResale - Provides insights into ticket resale pricing using GenAI.
 * - AnalyzeTicketResaleInput - The input type for the analyzeTicketResale function.
 * - AnalyzeTicketResaleOutput - The return type for the analyzeTicketResale function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTicketResaleInputSchema = z.object({
  eventDescription: z.string().describe('The description of the event for which the ticket is being resold.'),
  originalPrice: z.number().describe('The original price of the ticket.'),
  resalePrice: z.number().describe('The current resale price of the ticket.'),
  currentDemand: z.string().describe('A description of the current demand for the event tickets.'),
  venueDetails: z.string().describe('Details about the venue where the event is being held.'),
});
export type AnalyzeTicketResaleInput = z.infer<typeof AnalyzeTicketResaleInputSchema>;

const AnalyzeTicketResaleOutputSchema = z.object({
  fairPriceEstimate: z.number().describe('An estimated fair price for the resale ticket based on market conditions.'),
  potentialProfit: z.number().describe('The potential profit or loss if the ticket is bought and resold.'),
  riskAssessment: z.string().describe('An assessment of the risks involved in buying the resale ticket.'),
  marketSentiment: z.string().describe('An overview of the current market sentiment towards the event and tickets.'),
});
export type AnalyzeTicketResaleOutput = z.infer<typeof AnalyzeTicketResaleOutputSchema>;

export async function analyzeTicketResale(input: AnalyzeTicketResaleInput): Promise<AnalyzeTicketResaleOutput> {
  return analyzeTicketResaleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTicketResalePrompt',
  input: {schema: AnalyzeTicketResaleInputSchema},
  output: {schema: AnalyzeTicketResaleOutputSchema},
  prompt: `You are an expert in ticket resale market analysis. Given the details about an event and its resale ticket, provide a comprehensive analysis.

Event Description: {{{eventDescription}}}
Original Price: {{{originalPrice}}}
Resale Price: {{{resalePrice}}}
Current Demand: {{{currentDemand}}}
Venue Details: {{{venueDetails}}}

Analyze the provided information and estimate a fair price for the resale ticket, potential profit/loss, risks, and market sentiment.

Fair Price Estimate:
Potential Profit/Loss:
Risk Assessment:
Market Sentiment:`,
});

const analyzeTicketResaleFlow = ai.defineFlow(
  {
    name: 'analyzeTicketResaleFlow',
    inputSchema: AnalyzeTicketResaleInputSchema,
    outputSchema: AnalyzeTicketResaleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
