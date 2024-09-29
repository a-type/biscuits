import { ReactNode, createContext, useContext } from 'react';
import { AppId } from '@biscuits/apps';
import { VerdantContext } from '../verdant.js';
import { ClientDescriptor } from '@verdant-web/store';
import { AppPreviewNotice } from './AppPreviewNotice.js';
import { PrereleaseWarning } from './PrereleaseWarning.js';
import { TopLoader } from './TopLoader.js';
import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { Essentials } from './Essentials.js';
import {
	ApolloClient,
	ApolloProvider,
	graphqlClient as defaultClient,
} from '@biscuits/graphql';
import { GlobalSyncingIndicator } from './GlobalSyncingIndicator.js';

export function Provider({
	graphqlClient = defaultClient,
	appId,
	children,
	storeDescriptor = null,
}: {
	appId?: AppId;
	graphqlClient?: ApolloClient<any>;
	children: ReactNode;
	storeDescriptor?: ClientDescriptor<any, BiscuitsVerdantProfile> | null;
}) {
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
