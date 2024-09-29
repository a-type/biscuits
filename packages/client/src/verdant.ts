import { BiscuitsVerdantProfile, LibraryAccess } from '@biscuits/libraries';
import * as CONFIG from './config.js';
import { AppId } from '@biscuits/apps';
import { createContext } from 'react';
import { ClientDescriptor } from '@verdant-web/store';
import { fetch } from '@biscuits/graphql';

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
		authEndpoint: `${CONFIG.API_ORIGIN}/verdant/token/${appId}?access=${access}`,
		useBroadcastChannel: true,
		fetch,
	};
}

export const VerdantContext = createContext<ClientDescriptor<
	any,
	BiscuitsVerdantProfile
> | null>(null);
