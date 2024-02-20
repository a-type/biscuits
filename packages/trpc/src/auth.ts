import { t, userProcedure } from './common.js';

export const authRouter = t.router({
  session: userProcedure.query(async ({ ctx }) => {
    // refresh session
    await ctx.auth.setLoginSession(ctx.session);
    return ctx.session;
  }),
});
