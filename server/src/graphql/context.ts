import { Session } from '@a-type/auth';
import { DB } from '@biscuits/db';
import { Server as VerdantServer } from '@verdant-web/server';
import Stripe from 'stripe';
import { createDataloaders } from './dataloaders/index.js';
import { SsgStorage } from '../services/ssg.js';

export type GQLContext = {
  session: Session | null;
  req: Request;
  db: DB;
  verdant: VerdantServer;
  auth: {
    setLoginSession: (session: Session | null) => Promise<void>;
    applyHeaders: Headers;
  };
  stripe: Stripe;
  dataloaders: ReturnType<typeof createDataloaders>;
  ssg: {
    gnocchiHub: SsgStorage;
  };
};
