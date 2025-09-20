"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUser, type MockUser } from '@/lib/mock-data';

type UserContextType = {
  user: MockUser | null;
  setUser: React.Dispatch<React.SetStateAction<MockUser | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(mockUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
