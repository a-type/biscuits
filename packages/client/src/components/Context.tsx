import { ApolloProvider, ApolloClient } from '@apollo/client';
import { ReactNode, createContext, useContext } from 'react';
import { AppId } from '@biscuits/apps';
import { VerdantContext } from '../verdant.js';
import { ClientDescriptor } from '@verdant-web/store';
import { VerdantProfile } from '../index.js';

export function Provider({
  graphqlClient,
  appId,
  children,
  storeDescriptor = null,
}: {
  appId?: AppId;
  graphqlClient: ApolloClient<any>;
  children: ReactNode;
  storeDescriptor?: ClientDescriptor<any, VerdantProfile> | null;
}) {
  return (
    <ApolloProvider client={graphqlClient}>
      <BiscuitsContext.Provider value={{ appId }}>
        <VerdantContext.Provider value={storeDescriptor}>
          {children}
        </VerdantContext.Provider>
      </BiscuitsContext.Provider>
    </ApolloProvider>
  );
}

const BiscuitsContext = createContext<{ appId?: AppId } | null>(null);

export function useAppId() {
  const ctx = useContext(BiscuitsContext);
  if (!ctx) {
    throw new Error('useAppId must be used within a BiscuitsProvider');
  }
  if (!ctx.appId) {
    throw new Error('Cannot use useAppId in a non-app context');
  }
  return ctx.appId;
}

export function useMaybeAppId() {
  const ctx = useContext(BiscuitsContext);
  return ctx?.appId;
}
