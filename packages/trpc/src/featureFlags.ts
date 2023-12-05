import { z } from 'zod';
import { t } from './common.js';

export const featureFlagsRouter = t.router({
  getValue: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
    return false;
    // if (!ctx.session) return false;
    // const plan = null;
    // try {
    //   const flags = JSON.parse(plan?.featureFlags || '{}');
    //   return !!flags[input];
    // } catch (err) {
    //   return false;
    // }
  }),
});
