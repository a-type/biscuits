import {
  ClientDescriptor,
  createHooks,
  migrations,
  UserInfo,
} from '@shopping.biscuits/verdant';
import { getVerdantSync, VerdantProfile } from '@biscuits/client';
import { undoHistory } from './undo.js';

export interface Presence {
  /**
   * Put any transient presence state for users
   * you want here
   */
}

export type Participant = UserInfo<VerdantProfile, Presence>;

export const hooks = createHooks<Presence, VerdantProfile>();

export const clientDescriptor = new ClientDescriptor({
  namespace: 'shopping',
  migrations,
  undoHistory,
  sync: getVerdantSync({
    appId: 'shopping',
    access: 'members',
    initialPresence: {} satisfies Presence,
  }),
});

// these are some helpers I like to use. You can delete them if you want.

async function exposeClientOnWindowForDebug() {
  const client = await clientDescriptor.open();
  (window as any).client = client;
}

exposeClientOnWindowForDebug();
