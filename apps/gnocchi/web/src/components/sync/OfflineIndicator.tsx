import { Icon } from '@/components/icons/Icon.jsx';
import { Tooltip } from '@a-type/ui';
import { useIsOffline } from '@biscuits/client';

export function OfflineIndicator() {
	const offline = useIsOffline();

	if (!offline) return null;

	return (
		<Tooltip content="Offline - but your changes will be saved!">
			<Icon className="opacity-50" name="offline" />
		</Tooltip>
	);
}
