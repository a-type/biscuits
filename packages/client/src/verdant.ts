import { AppId } from '@biscuits/apps';
import { fetch } from '@biscuits/graphql';
import { BiscuitsVerdantProfile, LibraryAccess } from '@biscuits/libraries';
import { Client } from '@verdant-web/store';
import { createContext } from 'react';
import * as CONFIG from './config.js';

const LONG_PULL = 4 * 60 * 60 * 1000;
const SHORT_PULL = 45 * 1000;

export function getVerdantSync<Presence>({
	appId,
	initialPresence,
	access,
	dashboardMode,
}: {
	appId: AppId;
	initialPresence: Presence;
	access: LibraryAccess;
	dashboardMode?: boolean;
}) {
	return {
		initialPresence,
		defaultProfile: {
			id: '',
			name: 'Anonymous',
			imageUrl: null,
		} satisfies BiscuitsVerdantProfile,
		authEndpoint: `${CONFIG.API_ORIGIN}/verdant/token/${appId}?access=${access}`,
		useBroadcastChannel: true,
		fetch,
		pullInterval: dashboardMode ? LONG_PULL : SHORT_PULL,
	};
}

export const VerdantContext = createContext<Client<
	any,
	BiscuitsVerdantProfile
> | null>(null);
