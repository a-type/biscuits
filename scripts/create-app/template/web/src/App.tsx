import { verdant } from '@/store.js';
import { ErrorBoundary, Provider as UIProvider } from '@a-type/ui';
import {
	GlobalErrorFallback,
	Provider,
	useHasServerAccess,
} from '@biscuits/client';
import { RouterProvider } from '@tanstack/react-router';
import { ReactNode, Suspense } from 'react';
import { hooks } from './hooks.js';
import { router } from './router.js';

export interface AppProps {}

export function App({}: AppProps) {
	return (
		<ErrorBoundary fallback={(props) => <GlobalErrorFallback {...props} />}>
			<UIProvider manifestPath="/manifest.webmanifest">
				<Suspense>
					<Provider appId="{{todoId}}" verdantClient={verdant} router={router}>
						<VerdantProvider>
							<RouterProvider router={router} />
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
