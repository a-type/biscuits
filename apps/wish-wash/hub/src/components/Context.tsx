import React from 'react';
import { createContext, useContext } from 'react';

export const HubContext = createContext<{ wishlistSlug: string } | null>(null);

export function HubContextProvider({
  children,
  wishlistSlug,
}: {
  children: React.ReactNode;
  wishlistSlug: string;
}) {
  return (
    <HubContext.Provider value={{ wishlistSlug }}>
      {children}
    </HubContext.Provider>
  );
}

export function useHubContext() {
  const context = useContext(HubContext);
  if (!context) {
    throw new Error('useHubContext must be used within a HubContextProvider');
  }
  return context;
}
