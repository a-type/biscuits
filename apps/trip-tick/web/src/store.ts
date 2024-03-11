import {
  ClientDescriptor,
  createHooks,
  migrations,
  UserInfo,
} from '@trip-tick.biscuits/verdant';
import { CONFIG, getVerdantSync, VerdantProfile } from '@biscuits/client';

export interface Presence {
  /**
   * Put any transient presence state for users
   * you want here
   */
}

export type Participant = UserInfo<VerdantProfile, Presence>;

export const hooks = createHooks<Presence, VerdantProfile>();

export const clientDescriptor = new ClientDescriptor({
  namespace: 'trip-tick',
  sync: getVerdantSync({
    apiOrigin: CONFIG.API_ORIGIN,
    appId: 'trip-tick',
    initialPresence: {},
  }),
  migrations,
  log: console.debug,
});

// these are some helpers I like to use. You can delete them if you want.

async function exposeClientOnWindowForDebug() {
  const client = await clientDescriptor.open();
  (window as any).client = client;
}

async function registerUndoKeybinds() {
  const client = await clientDescriptor.open();
  document.addEventListener('keydown', async (e) => {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault();
      const result = await client.undoHistory.undo();
      if (!result) {
        console.log('Nothing to undo');
      }
    }
    if (
      (e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'z' && e.shiftKey && (e.ctrlKey || e.metaKey))
    ) {
      e.preventDefault();
      const result = await client.undoHistory.redo();
      if (!result) {
        console.log('Nothing to redo');
      }
    }
  });
}

exposeClientOnWindowForDebug();
registerUndoKeybinds();
