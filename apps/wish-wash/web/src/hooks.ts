import { createHooks } from '@wish-wash.biscuits/verdant';
import type { Presence } from './store.js';
import { VerdantProfile } from '@biscuits/client';

export const hooks = createHooks<Presence, VerdantProfile>();
