import { adminRouter } from './admin.js';
import { authRouter } from './auth.js';
import { t } from './common.js';
// import { featureFlagsRouter } from './featureFlags.js';
import { invitesRouter } from './invites.js';
import { planRouter } from './plan.js';
// import { changelogRouter } from './changelog.js';

export const appRouter = t.router({
  invites: invitesRouter,
  admin: adminRouter,
  // featureFlags: featureFlagsRouter,
  plan: planRouter,
  // changelog: changelogRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
