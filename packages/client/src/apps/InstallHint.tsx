import { Box, Button, P, useIsInstalled, useIsInstallReady } from '@a-type/ui';
import { useLocalStorage } from '../hooks/useStorage.js';
import { InstallButton } from './InstallButton.js';

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

	const installReady = useIsInstallReady();
	const isInstalled = useIsInstalled();

	if (isDismissed || isInstalled || !installReady) {
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
			<div className="w-full flex flex-row items-center justify-end gap-4">
				<Button emphasis="ghost" onClick={() => setIsDismissed(true)}>
					Dismiss
				</Button>
				<InstallButton emphasis="primary" size="default" />
			</div>
		</Box>
	);
}
