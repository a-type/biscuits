import { hooks } from '@/hooks.js';
import { Pages } from '@/pages/Pages.jsx';
import { verdant } from '@/store.js';
import { ErrorBoundary, H1, P, Provider as UIProvider } from '@a-type/ui';
import { Provider, ReloadButton, useHasServerAccess } from '@biscuits/client';
import '@biscuits/client/henrietta.css';
import { ReactNode, Suspense } from 'react';
import { SubscriptionDialog } from './components/promotion/SubscriptionDialog.jsx';

export interface AppProps {}

export function App({}: AppProps) {
	return (
		<ErrorBoundary fallback={<ErrorFallback />}>
			<UIProvider disableViewportOffset manifestPath="/manifest.webmanifest">
				<Suspense>
					<Provider appId="wish-wash" verdantClient={verdant}>
						<VerdantProvider>
							<Pages />
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
