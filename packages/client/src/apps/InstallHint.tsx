import { Box, Button, P } from '@a-type/ui';
import { lazy, Suspense } from 'react';
import { useSnapshot } from 'valtio';
import { useLocalStorage } from '../hooks/useStorage.js';
import { installState } from '../install.js';
import { getIsPWAInstalled } from '../platform.js';

const InstallButton = lazy(() => import('./InstallButton.js'));

export interface InstallHintProps {
	content: string;
	className?: string;
}

export function InstallHint({
	content: contentStr,
	className,
}: InstallHintProps) {
	const [isDismissed, setIsDismissed] = useLocalStorage(
		'pwa-install-hint-dismissed',
		false,
	);

	const { installReady } = useSnapshot(installState);

	if (isDismissed || getIsPWAInstalled() || !installReady) {
		return null;
	}

	return (
		<Box
			surface
			color="primary"
			p
			d="col"
			gap
			items="stretch"
			className={className}
		>
			<P>{contentStr}</P>
			<div className="flex flex-row items-center justify-end gap-4 w-full">
				<Button emphasis="ghost" onClick={() => setIsDismissed(true)}>
					Dismiss
				</Button>
				<Suspense
					fallback={
						<Button size="small" disabled loading emphasis="ghost">
							...
						</Button>
					}
				>
					<InstallButton emphasis="primary" />
				</Suspense>
			</div>
		</Box>
	);
}
