import { TRPCError } from '@trpc/server';
import { Context, t } from './common.js';
import * as z from 'zod';
import { comparePassword, hashPassword, id } from '@biscuits/db';

export const authRouter = t.router({
  isProductAdmin: t.procedure.query(async ({ ctx }) => {
    return ctx?.isProductAdmin;
  }),

  createEmailVerification: t.procedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        returnTo: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 36);
      const code = Math.floor(Math.random() * 1000000).toString();
      await ctx.db
        .insertInto('EmailVerification')
        .values({
          id: id(),
          email: input.email,
          name: input.name,
          code,
          expiresAt: expiresAt.toUTCString(),
        })
        .executeTakeFirst();
      await ctx.email.sendEmailVerification({
        to: input.email,
        code,
        returnTo: input.returnTo,
      });
      return {
        sent: true,
      };
    }),

  verifyEmail: t.procedure
    .input(
      z.object({
        code: z.string(),
        inviteId: z.string().optional(),
        returnTo: z.string().optional(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const verification = await ctx.db
        .selectFrom('EmailVerification')
        .select(['email', 'name'])
        .where('code', '=', input.code)
        .executeTakeFirst();

      if (!verification) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No verification found for that code',
        });
      }

      const existingUser = await ctx.db
        .selectFrom('Profile')
        .select(['id', 'password'])
        .where('email', '=', verification.email)
        .executeTakeFirst();

      if (existingUser?.password) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'An account already exists with that email. Try logging in.',
        });
      }

      const user = await joinViaEmail({
        inviteId: input.inviteId,
        email: verification.email,
        fullName: verification.name || 'Anonymous',
        password: input.password,
        ctx,
      });

      ctx.auth.setLoginSession({
        userId: user.id,
        planId: user.planId,
        name: user.friendlyName || user.fullName,
        role: user.planRole as 'admin' | 'user',
        isProductAdmin: user.isProductAdmin,
      });

      return {
        user,
      };
    }),

  emailLogin: t.procedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        returnTo: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const profile = await ctx.db
        .selectFrom('Profile')
        .selectAll()
        .where('email', '=', input.email)
        .executeTakeFirst();
      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user found for that email',
        });
      }
      if (!profile.password) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'No password login available. Try logging in with a social account.',
        });
      }
      if (!(await comparePassword(input.password, profile.password))) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password',
        });
      }

      ctx.auth.setLoginSession({
        userId: profile.id,
        planId: profile.planId,
        name: profile.friendlyName || profile.fullName,
        role: profile.planRole as 'admin' | 'user',
        isProductAdmin: profile.isProductAdmin,
      });

      return {
        profile,
      };
    }),

  resetPassword: t.procedure
    .input(
      z.object({
        email: z.string(),
        returnTo: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const profile = await ctx.db
        .selectFrom('Profile')
        .select(['id', 'email', 'friendlyName', 'fullName'])
        .where('email', '=', input.email)
        .executeTakeFirst();
      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user found for that email',
        });
      }
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 36);
      const code = Math.floor(Math.random() * 1000000).toString();
      const reset = await ctx.db
        .insertInto('PasswordReset')
        .values({
          id: id(),
          name: profile.friendlyName || profile.fullName,
          email: input.email,
          code,
          expiresAt: expiresAt.toUTCString(),
        })
        .onConflict((oc) =>
          oc.doUpdateSet({
            code,
            expiresAt: expiresAt.toUTCString(),
          }),
        )
        .executeTakeFirst();

      await ctx.email.sendPasswordReset({
        to: input.email,
        code,
        returnTo: input.returnTo,
      });
      return {
        sent: true,
      };
    }),

  verifyPasswordReset: t.procedure
    .input(
      z.object({
        code: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const reset = await ctx.db
        .selectFrom('PasswordReset')
        .select(['email', 'expiresAt'])
        .where('code', '=', input.code)
        .executeTakeFirst();
      if (!reset) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No password reset found for that code',
        });
      }
      if (reset.expiresAt < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Password reset has expired. Try sending another one',
        });
      }
      const profile = await ctx.db
        .selectFrom('Profile')
        .selectAll()
        .where('email', '=', reset.email)
        .executeTakeFirst();
      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user found for that email',
        });
      }

      await ctx.db
        .updateTable('Profile')
        .where('id', '=', profile.id)
        .set({
          password: await hashPassword(input.password),
        })
        .executeTakeFirst();
      await ctx.db
        .deleteFrom('PasswordReset')
        .where('email', '=', reset.email)
        .execute();

      ctx.auth.setLoginSession({
        userId: profile.id,
        planId: profile.planId,
        name: profile.friendlyName || profile.fullName,
        role: profile.planRole as 'admin' | 'user',
        isProductAdmin: profile.isProductAdmin,
      });
      return {
        profile,
      };
    }),

  session: t.procedure.query(async ({ ctx }) => {
    // refresh session cookie
    if (ctx.session) {
      ctx.auth.setLoginSession({
        userId: ctx.session.userId,
        planId: ctx.session.planId,
        name: ctx.session.name,
        role: ctx.session.role,
        isProductAdmin: ctx.session.isProductAdmin,
      });
    } else {
      ctx.auth.setLoginSession(null);
    }
    return {
      session: ctx.session,
    };
  }),
});

async function joinViaEmail({
  inviteId,
  email,
  fullName,
  password,
  ctx,
}: {
  // if provided, also join the plan associated
  // with this invite and consume the invite.
  inviteId?: string;
  email: string;
  fullName: string;
  password: string;
  ctx: Context;
}) {
  let joiningPlanId: string | null = null;

  if (inviteId) {
    // validate invite
    const invite = await ctx.db
      .selectFrom('PlanInvitation')
      .select(['id', 'planId', 'expiresAt', 'claimedAt'])
      .where('id', '=', inviteId)
      .executeTakeFirst();

    if (!invite) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No invite found for that code',
      });
    }
    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invite has expired',
      });
    }
    if (invite.claimedAt) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invite has already been claimed',
      });
    }

    joiningPlanId = invite.planId;
  }
  // upsert a new account and user
  const hashedPassword = await hashPassword(password);
  await ctx.db
    .insertInto('Profile')
    .values({
      email,
      fullName,
      planId: joiningPlanId,
      planRole: 'user',
      password: hashedPassword,
      friendlyName: fullName,
      isProductAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: id(),
    })
    .onConflict((oc) =>
      oc.doUpdateSet({
        planId: joiningPlanId,
        planRole: 'user',
        updatedAt: new Date().toISOString(),
      }),
    )
    .executeTakeFirst();

  // mark invite as used only after join is successful
  if (inviteId) {
    await ctx.db
      .updateTable('PlanInvitation')
      .where('id', '=', inviteId)
      .set({
        claimedAt: new Date().toISOString(),
      })
      .execute();
  }

  const profile = await ctx.db
    .selectFrom('Profile')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirstOrThrow();

  return profile;
}
