import { Pages } from '@/pages/Pages.jsx';
import { hooks, verdant } from '@/store.js';
import { FullScreenSpinner, Provider as UIProvider } from '@a-type/ui';
import { Provider, useHasServerAccess } from '@biscuits/client';
import { ReactNode, Suspense } from 'react';
import { Explainer } from './components/onboarding/Explainer.jsx';

export function App() {
	return (
		<div className="flex flex-col flex-1 w-full h-full">
			<Suspense fallback={<FullScreenSpinner />}>
				<UIProvider disableViewportOffset manifestPath="/manifest.webmanifest">
					<Provider appId="trip-tick" verdantClient={verdant as any}>
						<LofiProvider>
							<Pages />
							<Explainer />
						</LofiProvider>
					</Provider>
				</UIProvider>
			</Suspense>
		</div>
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
