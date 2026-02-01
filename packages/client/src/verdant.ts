import { AppId } from '@biscuits/apps';
import { fetch } from '@biscuits/graphql';
import { BiscuitsVerdantProfile, LibraryAccess } from '@biscuits/libraries';
import { Client, ServerSyncOptions } from '@verdant-web/store';
import { createContext } from 'react';
import * as CONFIG from './config.js';

const SHORT_PULL = 45 * 1000;

export function getVerdantSync<Presence>({
	appId,
	initialPresence,
	access,
}: {
	appId: AppId;
	initialPresence: Presence;
	access: LibraryAccess;
}) {
	return {
		initialPresence,
		defaultProfile: {
			id: '',
			name: 'Anonymous',
			imageUrl: null,
		} satisfies BiscuitsVerdantProfile,
		useBroadcastChannel: true,
		fetchAuth: async () => {
			console.log('HERE');
			const response = await fetch(
				`${CONFIG.API_ORIGIN}/verdant/token/${appId}?access=${access}`,
				{
					credentials: 'include',
				},
			);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch Verdant auth token: ${response.status} ${response.statusText}`,
				);
			}
			const data = await response.json();
			return data;
		},
		pullInterval: SHORT_PULL,
		automaticTransportSelection: 'peers-only',
	} satisfies ServerSyncOptions;
}

export const VerdantContext = createContext<Client<
	any,
	BiscuitsVerdantProfile
> | null>(null);
