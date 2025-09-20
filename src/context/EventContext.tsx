"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockEvents, type MockEvent } from '@/lib/mock-data';

type EventContextType = {
  events: MockEvent[];
  addEvent: (event: Omit<MockEvent, 'id' | 'priceRange' | 'imageId'>, tickets: {price: number}[], imagePreview: string | null) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<MockEvent[]>(mockEvents);

  const addEvent = useCallback((event: Omit<MockEvent, 'id' | 'priceRange' | 'imageId'>, tickets: {price: number}[], imagePreview: string | null) => {
    const prices = tickets.map(t => t.price);
    const newEvent: MockEvent = {
      ...event,
      id: `event-${Date.now()}`,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
      // In a real app this would be an uploaded URL, but we'll use a placeholder
      imageId: `event-${Math.floor(Math.random() * 4) + 1}`,
    };
    
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  }, []);

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
