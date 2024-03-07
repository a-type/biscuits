import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { CONFIG } from './index.js';
import { AppId } from '@biscuits/apps';

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
  };
}
