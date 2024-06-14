import { ApolloProvider, ApolloClient } from '@apollo/client';
import { ReactNode, createContext, useContext } from 'react';
import { AppId } from '@biscuits/apps';
import { VerdantContext } from '../verdant.js';
import { ClientDescriptor } from '@verdant-web/store';
import {
  AppPreviewNotice,
  Essentials,
  PrereleaseWarning,
  TopLoader,
  VerdantProfile,
} from '../index.js';
import { graphqlClient as defaultClient } from '../index.js';
import { GlobalSyncingIndicator } from './GlobalSyncingIndicator.js';
import { useVisualViewportOffset } from '@a-type/ui/hooks';

export function Provider({
  graphqlClient = defaultClient,
  appId,
  children,
  storeDescriptor = null,
}: {
  appId?: AppId;
  graphqlClient?: ApolloClient<any>;
  children: ReactNode;
  storeDescriptor?: ClientDescriptor<any, VerdantProfile> | null;
}) {
  useVisualViewportOffset();

  return (
    <ApolloProvider client={graphqlClient}>
      <BiscuitsContext.Provider value={{ appId }}>
        <VerdantContext.Provider value={storeDescriptor}>
          {appId && <AppPreviewNotice />}
          {appId && <PrereleaseWarning />}
          <TopLoader />
          {storeDescriptor && <GlobalSyncingIndicator />}
          {children}
          <Essentials />
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
