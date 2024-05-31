import { getVerdantSync } from '@biscuits/client';
import {
  ClientDescriptor,
  createHooks,
  migrations,
  UserInfo,
} from '@star-chart.biscuits/verdant';

export interface Presence {
  /**
   * Put any transient presence state for users
   * you want here
   */
  cursorActive: boolean;
  cursorPosition?: { x: number; y: number };
}

// should match server
export interface Profile {
  id: string;
  name: string;
  imageUrl: string | null;
}

export type Participant = UserInfo<Profile, Presence>;

export const hooks = createHooks<Presence, Profile>();

export const clientDescriptor = new ClientDescriptor({
  namespace: 'star-chart',
  migrations,
  sync: getVerdantSync({
    appId: 'star-chart',
    initialPresence: {
      cursorActive: false,
      cursorPosition: undefined,
    },
    access: 'members',
  }),
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
