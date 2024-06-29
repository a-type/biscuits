import { Client } from '@wish-wash.biscuits/verdant';
import { createContext, useContext } from 'react';

export interface ListContextProps {
  listId: string;
  client: Client;
}

const listContext = createContext<ListContextProps | undefined>(undefined);

export const ListProvider = listContext.Provider;

export function useListContext() {
  const context = useContext(listContext);
  if (!context) {
    throw new Error('useListContext must be used within a ListContextProvider');
  }
  return context;
}
