import { clsx, Icon } from '@a-type/ui';
import { useContext, useEffect, useState } from 'react';
import { VerdantContext } from '../verdant.js';

export interface GlobalSyncingIndicatorProps {}

export function GlobalSyncingIndicator({}: GlobalSyncingIndicatorProps) {
	const [syncing, setSyncing] = useState(false);
	const client = useContext(VerdantContext);
	useEffect(() => {
		return client?.sync.subscribe('syncingChange', setSyncing);
	}, [client]);

	if (!client) return null;

	return (
		<div
			className={clsx(
				'pointer-events-none fixed right-2 top-2 z-tooltip flex flex-row items-center gap-1 rounded-full p-1 text-xs opacity-0 transition-opacity transition-delay-500 bg-gray-wash',
				{
					'opacity-100': syncing,
				},
			)}
			aria-hidden={!syncing}
		>
			<Icon name="refresh" className="animate-spin" />
			<span>Syncing</span>
		</div>
	);
}
