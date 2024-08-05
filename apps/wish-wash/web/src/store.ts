import { ClientDescriptor, UserInfo } from '@wish-wash.biscuits/verdant';
import { getVerdantSync, VerdantProfile } from '@biscuits/client';
import { undoHistory } from './undo.js';

export interface Presence {
  /**
   * Put any transient presence state for users
   * you want here
   */
}

export type Participant = UserInfo<VerdantProfile, Presence>;

export const clientDescriptor = new ClientDescriptor({
  namespace: 'wish-wash',
  undoHistory,
  sync: getVerdantSync({
    appId: 'wish-wash',
    access: 'members',
    initialPresence: {} satisfies Presence,
  }),
  log: console.debug,
});

// these are some helpers I like to use. You can delete them if you want.

async function exposeClientOnWindowForDebug() {
  const client = await clientDescriptor.open();
  (window as any).client = client;
}

exposeClientOnWindowForDebug();
