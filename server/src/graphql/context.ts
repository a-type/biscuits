import { Session } from '@a-type/auth';
import { DB } from '@biscuits/db';
import { Server as VerdantServer } from '@verdant-web/server';

export type GQLContext = {
  session: Session | null;
  req: Request;
  db: DB;
  verdant: VerdantServer;
  auth: {
    setLoginSession: (session: Session | null) => Promise<void>;
  };
};
