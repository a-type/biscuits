import { Pages } from '@/pages/Pages.jsx';
import { verdant } from '@/store.js';
import { ErrorBoundary, Provider as UIProvider } from '@a-type/ui';
import { Provider, useHasServerAccess } from '@biscuits/client';
import { GlobalErrorFallback } from '@biscuits/client/apps';
import { ReactNode, Suspense } from 'react';
import { hooks } from './hooks.js';

export interface AppProps {}

export function App({}: AppProps) {
	return (
		<ErrorBoundary fallback={<GlobalErrorFallback />}>
			<UIProvider manifestPath="/manifest.webmanifest">
				<Suspense>
					<Provider appId="mood" verdantClient={verdant as any}>
						<VerdantProvider>
							<Pages />
						</VerdantProvider>
					</Provider>
				</Suspense>
			</UIProvider>
		</ErrorBoundary>
	);
}

function VerdantProvider({ children }: { children: ReactNode }) {
	// only sync if logged in to the server
	const isLoggedIn = useHasServerAccess();
	return (
		<hooks.Provider value={verdant} sync={isLoggedIn}>
			{children}
		</hooks.Provider>
	);
}
