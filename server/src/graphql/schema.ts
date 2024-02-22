import { builder } from './builder.js';
import './types/plan.js';
import './types/planInvitation.js';
import './types/planLibraryInfo.js';
import './types/user.js';
import './types/scalars.js';

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema();
