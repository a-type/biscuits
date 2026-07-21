import { router } from '@/router.js';
import { hooks, verdant } from '@/store.js';
import { FullScreenSpinner, Provider as UIProvider } from '@a-type/ui';
import { Provider, useHasServerAccess } from '@biscuits/client';
import { RouterProvider } from '@tanstack/react-router';
import { ReactNode, Suspense } from 'react';
import { Explainer } from './components/onboarding/Explainer.jsx';

export function App() {
	return (
		<Suspense fallback={<FullScreenSpinner />}>
			<UIProvider disableViewportOffset manifestPath="/manifest.webmanifest">
				<Provider appId="trip-tick" verdantClient={verdant} router={router}>
					<LofiProvider>
						<RouterProvider router={router} />
						<Explainer />
					</LofiProvider>
				</Provider>
			</UIProvider>
		</Suspense>
	);
}

function LofiProvider({ children }: { children: ReactNode }) {
	// only sync if logged in to the server
	const isLoggedIn = useHasServerAccess();
	return (
		<hooks.Provider value={verdant} sync={isLoggedIn}>
			{children}
		</hooks.Provider>
	);
}
