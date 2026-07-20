import { ReloadButton } from '@/components/sync/ReloadButton.jsx';
import { GlobalLoader } from '@biscuits/client/apps';
import { Box, ErrorBoundary, H1, P, Provider as UIProvider } from '@a-type/ui';
import { Provider, useFeatureFlag } from '@biscuits/client';
import { RouterProvider } from '@tanstack/react-router';
import { Suspense, useEffect, useState } from 'react';
import { AppMoved } from './components/promotional/AppMoved.jsx';
import { router } from './router.js';
import { verdant } from './stores/groceries/index.js';
import { Provider as GroceriesProvider } from './stores/groceries/Provider.jsx';

export function App() {
	const [keyboardOverlay, setKeyboardOverlay] = useState(false);
	return (
		<Box full col grow className="@mode-lemon">
			<ErrorBoundary fallback={<ErrorFallback />}>
				<UIProvider
					manifestPath="/manifest.webmanifest"
					virtualKeyboardBehavior={keyboardOverlay ? 'overlay' : undefined}
				>
					<Suspense fallback={<GlobalLoader />}>
						<Provider appId="gnocchi" verdantClient={verdant as any}>
							<GroceriesProvider>
								<RouterProvider router={router} />
								<AppMoved />
							</GroceriesProvider>
							<KeyboardOverlayReader set={setKeyboardOverlay} />
						</Provider>
					</Suspense>
				</UIProvider>
			</ErrorBoundary>
		</Box>
	);
}

function KeyboardOverlayReader({ set }: { set: (value: boolean) => void }) {
	const value = useFeatureFlag('overlayKeyboard');
	useEffect(() => {
		set(!!value);
	}, [value, set]);
	return null;
}

function ErrorFallback() {
	return (
		<Box full col layout="center center" p grow>
			<Box col layout="start center" gap style={{ maxWidth: 700 }}>
				<H1>Something went wrong</H1>
				<P>
					{`Sorry about this. The app has crashed. You can try refreshing, but if that doesn't work, `}
					<a
						style={{ fontWeight: 'bold', textDecoration: 'underline' }}
						href="mailto:hi@biscuits.club"
					>
						let me know about it.
					</a>
				</P>
				<ReloadButton />
			</Box>
		</Box>
	);
}
