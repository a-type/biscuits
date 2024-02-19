import { TRPCError, initTRPC } from '@trpc/server';
import type { DB } from '@biscuits/db';
import type { Email } from '@biscuits/email';
import Stripe from 'stripe';

export type Session = {
  name: string | null;
  isProductAdmin: boolean;
  role: 'admin' | 'user' | null;
  planId: string | null;
  userId: string;
};

type Verdant = {
  evictUser: (libraryId: string, userId: string) => void;
  evictLibrary: (libraryId: string) => void;
  getLibraryInfo: (libraryId: string) => Promise<any>;
};

type Auth = {
  setLoginSession: (session: Session | null) => Promise<void>;
};

export type Context = {
  req: Request;
  deployedContext: {
    apiHost: string;
    uiOrigin: string;
  };
  session: Session | null;
  db: DB;
  auth: Auth;
  verdant: Verdant;
  email: Email;
  stripe: Stripe;
};

export const t = initTRPC.context<Context>().create({
  // transformer: superjson,
  errorFormatter({ shape }) {
    console.error(shape);
    return shape;
  },
});

export const publicProcedure = t.procedure;
export const userProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.session) {
    throw new TRPCError({
      message: 'Please log in',
      code: 'UNAUTHORIZED',
    });
  }
  return opts.next({
    ctx: {
      ...ctx,
      session: ctx.session!,
    },
  });
});
export const adminProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.session?.isProductAdmin) {
    throw new TRPCError({
      message: 'Not authorized',
      code: 'FORBIDDEN',
    });
  }
  return opts.next({
    ctx: {
      ...ctx,
      session: ctx.session!,
    },
  });
});
