import { AppId } from '@biscuits/apps';
import { fetch } from '@biscuits/graphql';
import { BiscuitsVerdantProfile, LibraryAccess } from '@biscuits/libraries';
import { ClientDescriptor } from '@verdant-web/store';
import { createContext } from 'react';
import * as CONFIG from './config.js';

const FOUR_HOURS = 4 * 60 * 60 * 1000;
const FIFTEEN_SECONDS = 15 * 1000;

const syncOriginOverride = localStorage.getItem('verdantSyncOrigin');

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
		authEndpoint: `${syncOriginOverride || CONFIG.API_ORIGIN}/verdant/token/${appId}?access=${access}`,
		useBroadcastChannel: true,
		fetch,
		pullInterval: dashboardMode ? FOUR_HOURS : FIFTEEN_SECONDS,
	};
}

export const VerdantContext = createContext<ClientDescriptor<
	any,
	BiscuitsVerdantProfile
> | null>(null);
