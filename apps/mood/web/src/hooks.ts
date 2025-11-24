import { createHooks } from '@mood.biscuits/verdant';
import { VerdantProfile } from '@biscuits/client';
import { Presence } from './store.js';

export const hooks = createHooks<Presence, VerdantProfile>();
