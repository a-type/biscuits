import { builder } from './builder.js';
import './types/plan.js';
import './types/planInvitation.js';
import './types/planLibraryInfo.js';
import './types/user.js';
import './types/scalars.js';
import './types/productInfo.js';
import './types/pushSubscription.js';
import './types/changelog.js';

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema();
