import { Pages } from '@/pages/Pages.jsx';
import { clientDescriptor, hooks } from '@/store.js';
import { FullScreenSpinner, Provider as UIProvider } from '@a-type/ui';
import { Provider, useHasServerAccess } from '@biscuits/client';
import { ReactNode, Suspense } from 'react';
import { Explainer } from './components/onboarding/Explainer.jsx';

export function App() {
	return (
		<div className="flex flex-col flex-1 w-full h-full">
			<Suspense fallback={<FullScreenSpinner />}>
				<UIProvider disableViewportOffset>
					<Provider appId="trip-tick" storeDescriptor={clientDescriptor as any}>
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
		<hooks.Provider value={clientDescriptor} sync={isLoggedIn}>
			{children}
		</hooks.Provider>
	);
}
