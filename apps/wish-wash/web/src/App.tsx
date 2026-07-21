import { hooks } from '@/hooks.js';
import { router } from '@/router.js';
import { verdant } from '@/store.js';
import { ErrorBoundary, Provider as UIProvider } from '@a-type/ui';
import { Provider, useHasServerAccess } from '@biscuits/client';
import { GlobalErrorFallback } from '@biscuits/client/apps';
import { RouterProvider } from '@tanstack/react-router';
import { ReactNode, Suspense } from 'react';
import { SubscriptionDialog } from './components/promotion/SubscriptionDialog.jsx';

export interface AppProps {}

export function App({}: AppProps) {
	return (
		<ErrorBoundary
			fallback={({ clearError }) => (
				<GlobalErrorFallback clearError={clearError} />
			)}
		>
			<UIProvider disableViewportOffset manifestPath="/manifest.webmanifest">
				<Suspense>
					<Provider appId="wish-wash" verdantClient={verdant} router={router}>
						<VerdantProvider>
							<RouterProvider router={router} />
							<SubscriptionDialog />
						</VerdantProvider>
					</Provider>
				</Suspense>
			</UIProvider>
		</ErrorBoundary>
	);
}

function VerdantProvider({ children }: { children: ReactNode }) {
	const canSync = useHasServerAccess();
	return (
		<hooks.Provider value={verdant} sync={canSync}>
			{children}
		</hooks.Provider>
	);
}
