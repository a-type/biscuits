import { builder } from './builder.js';
import './types/plan.js';
import './types/planInvitation.js';
import './types/planLibraryInfo.js';
import './types/user.js';
import './types/scalars.js';
import './types/productInfo.js';
import './types/pushSubscription.js';
import './types/changelog.js';

import './types/gnocchi/index.js';
import './types/wishWash/index.js';

import './types/common/index.js';

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema();
