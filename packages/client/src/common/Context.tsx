import { AppId } from '@biscuits/apps';
import {
	ApolloClient,
	ApolloProvider,
	graphqlClient as defaultClient,
} from '@biscuits/graphql';
import { ReactNode, createContext, useContext } from 'react';
import { AppPreviewNotice } from '../apps/AppPreviewNotice.js';
import { Essentials } from '../apps/Essentials.js';
import { VerdantContext } from '../verdant.js';
import { GlobalSyncingIndicator } from './GlobalSyncingIndicator.js';
import { PrereleaseWarning } from './PrereleaseWarning.js';
import { TopLoader } from './TopLoader.js';

export function Provider({
	graphqlClient = defaultClient,
	appId,
	children,
	verdantClient = null,
	disablePreviewWarning,
}: {
	appId?: AppId;
	graphqlClient?: ApolloClient<any>;
	children: ReactNode;
	verdantClient?: any | null;
	disablePreviewWarning?: boolean;
}) {
	return (
		<ApolloProvider client={graphqlClient}>
			<BiscuitsContext.Provider value={{ appId }}>
				<VerdantContext.Provider value={verdantClient}>
					{appId && <AppPreviewNotice />}
					{appId && !disablePreviewWarning && <PrereleaseWarning />}
					<TopLoader />
					{verdantClient && <GlobalSyncingIndicator />}
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
