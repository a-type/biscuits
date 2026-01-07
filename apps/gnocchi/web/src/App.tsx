import { ReloadButton } from '@/components/sync/ReloadButton.jsx';
import { GlobalLoader } from '@/GlobalLoader.jsx';
import { ErrorBoundary, H1, P, Provider as UIProvider } from '@a-type/ui';
import { Provider, useFeatureFlag } from '@biscuits/client';
import classNames from 'classnames';
import { Suspense, useEffect, useState } from 'react';
import { AppMoved } from './components/promotional/AppMoved.jsx';
import { Pages } from './pages/Pages.jsx';
import { verdant } from './stores/groceries/index.js';
import { Provider as GroceriesProvider } from './stores/groceries/Provider.jsx';

export function App() {
	const [keyboardOverlay, setKeyboardOverlay] = useState(false);
	return (
		<div
			className={classNames(
				'flex flex-col flex-1 w-full h-full',
				'theme-lemon',
			)}
		>
			<ErrorBoundary fallback={<ErrorFallback />}>
				<UIProvider
					manifestPath="/manifest.webmanifest"
					virtualKeyboardBehavior={keyboardOverlay ? 'overlay' : undefined}
				>
					<Suspense fallback={<GlobalLoader />}>
						<Provider appId="gnocchi" verdantClient={verdant as any}>
							<GroceriesProvider>
								<Pages />
								<AppMoved />
							</GroceriesProvider>
							<KeyboardOverlayReader set={setKeyboardOverlay} />
						</Provider>
					</Suspense>
				</UIProvider>
			</ErrorBoundary>
		</div>
	);
}

function KeyboardOverlayReader({ set }: { set: (value: boolean) => void }) {
	const value = useFeatureFlag('overlayKeyboard');
	useEffect(() => {
		set(!!value);
	}, [value]);
	return null;
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
