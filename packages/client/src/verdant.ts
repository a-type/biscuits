import { BiscuitsVerdantProfile, LibraryAccess } from '@biscuits/libraries';
import { CONFIG, VerdantProfile } from './index.js';
import { AppId } from '@biscuits/apps';
import { createContext } from 'react';
import { ClientDescriptor } from '@verdant-web/store';
import { fetch } from './fetch.js';

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
  VerdantProfile
> | null>(null);
