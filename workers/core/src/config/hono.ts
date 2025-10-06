import { Session } from '@a-type/auth';

type Variables = {
	requestId: string;
	customDomain?: string;
	session: Session | null;
};

export type HonoEnv = { Bindings: Env; Variables: Variables };
