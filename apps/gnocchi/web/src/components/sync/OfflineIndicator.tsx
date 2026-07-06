import { Icon, Tooltip } from '@a-type/ui';
import { useIsOffline } from '@biscuits/client';

export function OfflineIndicator() {
	const offline = useIsOffline();

	if (!offline) return null;

	return (
		<Tooltip content="Offline - but your changes will be saved!">
			<Icon style={{ opacity: 0.5 }} name="offline" />
		</Tooltip>
	);
}
