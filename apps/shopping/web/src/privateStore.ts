import {
  ClientDescriptor,
  createHooks,
  migrations,
  UserInfo,
} from '@shopping.biscuits/verdant';
import { CONFIG, getVerdantSync, VerdantProfile } from '@biscuits/client';
import { undoHistory } from './undo.js';

export interface Presence {
  /**
   * Put any transient presence state for users
   * you want here
   */
}

export type Participant = UserInfo<VerdantProfile, Presence>;

export const privateHooks = createHooks<Presence, VerdantProfile>();

export const privateClientDescriptor = new ClientDescriptor({
  namespace: 'private_shopping',
  migrations,
  undoHistory,
  sync: getVerdantSync({
    appId: 'shopping',
    access: 'user',
    initialPresence: {} satisfies Presence,
  }),
});

// these are some helpers I like to use. You can delete them if you want.

async function exposeClientOnWindowForDebug() {
  const privateClient = await privateClientDescriptor.open();
  (window as any).client = privateClient;
}

exposeClientOnWindowForDebug();
