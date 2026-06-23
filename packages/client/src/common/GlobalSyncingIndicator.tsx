import { clsx, Icon } from '@a-type/ui';
import { useContext, useEffect, useState } from 'react';
import { VerdantContext } from '../verdant.js';
import cls from './GlobalSyncingIndicator.module.css';

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
			className={clsx(cls.root, '@mode-denser', {
				'opacity-100': syncing,
			})}
			aria-hidden={!syncing}
		>
			<Icon name="refresh" className={cls.spin} />
			<span>Syncing</span>
		</div>
	);
}
