import { clsx, Icon } from '@a-type/ui';
import { useContext, useEffect, useState } from 'react';
import { VerdantContext } from '../verdant.js';

export interface GlobalSyncingIndicatorProps {}

export function GlobalSyncingIndicator({}: GlobalSyncingIndicatorProps) {
	const [syncing, setSyncing] = useState(false);
	const clientDesc = useContext(VerdantContext);
	useEffect(() => {
		if (!clientDesc?.current) return;
		const client = clientDesc.current;
		return client.sync.subscribe('syncingChange', setSyncing);
	}, [clientDesc]);

	if (!clientDesc) return null;

	return (
		<div
			className={clsx(
				'fixed top-2 right-2 z-tooltip bg-gray-1 rounded-full p-1 text-xs flex flex-row gap-1 items-center transition-opacity transition-delay-500 opacity-0 pointer-events-none',
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
