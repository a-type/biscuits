import { Provider as UrqlProvider } from 'urql';
import { ReactNode, createContext, useContext } from 'react';
import type { Client } from 'urql';
import { AppId } from '@biscuits/apps';

export function Provider({
  graphqlClient,
  appId,
  children,
}: {
  appId: AppId;
  graphqlClient: Client;
  children: ReactNode;
}) {
  return (
    <UrqlProvider value={graphqlClient}>
      <BiscuitsContext.Provider value={{ appId }}>
        {children}
      </BiscuitsContext.Provider>
    </UrqlProvider>
  );
}

const BiscuitsContext = createContext<{ appId: AppId } | null>(null);

export function useAppId() {
  const ctx = useContext(BiscuitsContext);
  if (!ctx) {
    throw new Error('useAppId must be used within a BiscuitsProvider');
  }
  return ctx.appId;
}
