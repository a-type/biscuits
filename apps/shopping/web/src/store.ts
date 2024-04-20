import {
  ClientDescriptor,
  createHooks,
  migrations,
  UserInfo,
} from '@shopping.biscuits/verdant';
import { VerdantProfile } from '@biscuits/client';
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
});

// these are some helpers I like to use. You can delete them if you want.

async function exposeClientOnWindowForDebug() {
  const client = await clientDescriptor.open();
  (window as any).client = client;
}

exposeClientOnWindowForDebug();
