
'use server';

import { analyzeTicketResale, AnalyzeTicketResaleInput, AnalyzeTicketResaleOutput } from '@/ai/flows/ticket-resale-analyzer';

export async function getResaleAnalysis(input: AnalyzeTicketResaleInput): Promise<AnalyzeTicketResaleOutput> {
  try {
    const result = await analyzeTicketResale(input);
    return result;
  } catch (error) {
    console.error("Error in getResaleAnalysis:", error);
    throw new Error("Failed to analyze ticket resale data.");
  }
}
