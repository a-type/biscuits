import { BiscuitsVerdantProfile } from '@biscuits/libraries';

export function getVerdantSync<Presence>({
  apiOrigin,
  appId,
  initialPresence,
}: {
  apiOrigin: string;
  appId: string;
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
  };
}
