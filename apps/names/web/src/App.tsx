import { Pages } from '@/pages/Pages.jsx';
import { clientDescriptor } from '@/store.js';
import { ErrorBoundary, H1, P, Provider as UIProvider } from '@a-type/ui';
import { Provider, ReloadButton, useHasServerAccess } from '@biscuits/client';
import { ReactNode, Suspense } from 'react';
import { LocationRequestDialog } from './components/location/LocationRequestDialog.jsx';
import { SuperBarProvider } from './components/superBar/SuperBarContext.jsx';
import { hooks } from './hooks.js';

export interface AppProps {}

export function App({}: AppProps) {
	return (
		<ErrorBoundary fallback={<ErrorFallback />}>
			<UIProvider>
				<Suspense>
					<Provider appId="names" storeDescriptor={clientDescriptor as any}>
						<VerdantProvider>
							<SuperBarProvider>
								<Pages />
								<LocationRequestDialog />
							</SuperBarProvider>
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
		<hooks.Provider value={clientDescriptor} sync={isLoggedIn}>
			{children}
		</hooks.Provider>
	);
}

function ErrorFallback() {
	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="flex flex-col items-start justify-center gap-4 max-w-700px">
				<H1>Something went wrong</H1>
				<P>
					Sorry about this. The app has crashed. You can try refreshing, but if
					that doesn&apos;t work,{' '}
					<a className="underline font-bold" href="mailto:hi@biscuits.club">
						let me know about it.
					</a>
				</P>
				<ReloadButton />
			</div>
		</div>
	);
}
