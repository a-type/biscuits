import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { CONFIG, VerdantProfile } from './index.js';
import { AppId } from '@biscuits/apps';
import { createContext } from 'react';
import { ClientDescriptor } from '@verdant-web/store';
import { fetch } from './fetch.js';

export function getVerdantSync<Presence>({
  apiOrigin = CONFIG.API_ORIGIN,
  appId,
  initialPresence,
}: {
  apiOrigin?: string;
  appId: AppId;
  initialPresence: Presence;
}) {
  return {
    initialPresence,
    defaultProfile: {
      id: '',
      name: 'Anonymous',
      imageUrl: null,
    } satisfies BiscuitsVerdantProfile,
    authEndpoint: `${apiOrigin}/verdant/token/${appId}`,
    useBroadcastChannel: true,
    fetch,
  };
}

export const VerdantContext = createContext<ClientDescriptor<
  any,
  VerdantProfile
> | null>(null);
