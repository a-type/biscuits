import { ApolloProvider, ApolloClient } from '@apollo/client';
import { ReactNode, createContext, useContext } from 'react';
import { AppId } from '@biscuits/apps';

export function Provider({
  graphqlClient,
  appId,
  children,
}: {
  appId?: AppId;
  graphqlClient: ApolloClient<any>;
  children: ReactNode;
}) {
  return (
    <ApolloProvider client={graphqlClient}>
      <BiscuitsContext.Provider value={{ appId }}>
        {children}
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
