import {
	Button,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@a-type/ui';
import { apps } from '@biscuits/apps';
import { ReactElement, useEffect } from 'react';
import * as CONFIG from '../config.js';
import { getIsPWAInstalled } from '../platform.js';
import { useAppId } from './Context.js';

export interface AppPickerProps {
	className?: string;
	children?: ReactElement;
}

export function AppPicker({ className, children }: AppPickerProps) {
	const hostApp = useAppId();
	// listen for iframeMessages to trigger app navigation
	useEffect(() => {
		const listener = (event: MessageEvent) => {
			if (event.origin === CONFIG.HOME_ORIGIN) {
				const { type, payload } = event.data;
				if (type === 'navigate') {
					const appId = payload.appId;
					const app = apps.find((app) => app.id === appId);
					if (app) {
						const url = new URL(
							import.meta.env.DEV ? app.devOriginOverride : app.url,
						);
						if (getIsPWAInstalled()) {
							// when opening another app from a PWA, unless the other app's PWA
							// is installed, it opens inside a frame in the current PWA. That's not
							// ideal, so we add a query param to the URL to indicate that the other
							// app should show a banner to the user about how to install.
							url.searchParams.set('appPickerFrom', hostApp);
						}
						window.location.href = url.toString();
					}
				}
			}
		};
		window.addEventListener('message', listener);
		return () => window.removeEventListener('message', listener);
	}, [hostApp]);

	if (getIsPWAInstalled()) {
		// app picker doesn't really work in a PWA :(
		return null;
	}

	return (
		<Popover>
			<PopoverTrigger
				className={className}
				render={() =>
					children ?? (
						<Button emphasis="ghost">
							<Icon name="cardsGrid" />
						</Button>
					)
				}
			/>
			<PopoverContent
				align="end"
				side="top"
				className="min-w-0 p-0"
				sideOffset={-40}
			>
				<iframe
					className="border-none p-0 shadow-none focus:outline-none"
					src={`${CONFIG.HOME_ORIGIN}/appPicker/index.html?hostApp=${hostApp}`}
					title="App Picker"
					style={{
						width: 40 * 2 + 16 + 32,
						height: 40 * 2 + 16 + 32,
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
