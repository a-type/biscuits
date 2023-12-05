import { initTRPC } from '@trpc/server';
import type { Request, Response } from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { DB } from '@biscuits/db';
import type { Email } from '@biscuits/email';
import Stripe from 'stripe';

type Session = {
  name: string | null;
  isProductAdmin: boolean;
  role: 'admin' | 'user';
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
  res: Response;
  deployedContext: {
    apiHost: string;
    uiOrigin: string;
  };
  session: Session | null;
  isProductAdmin: boolean;
  db: DB;
  auth: Auth;
  verdant: Verdant;
  email: Email;
  stripe: Stripe;
};

export const createContext = ({
  session,
  ...rest
}: trpcExpress.CreateExpressContextOptions & {
  deployedContext: {
    apiHost: string;
    uiOrigin: string;
  };
  session: Session | null;
  db: DB;
  verdant: Verdant;
  email: Email;
  auth: Auth;
  stripe: Stripe;
}): Context => {
  return {
    session,
    isProductAdmin: session?.isProductAdmin ?? false,
    ...rest,
  };
};

export const t = initTRPC.context<Context>().create({
  // transformer: superjson,
  errorFormatter({ shape }) {
    console.error(shape);
    return shape;
  },
});
