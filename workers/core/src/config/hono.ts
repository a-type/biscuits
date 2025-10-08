import { Session } from '@a-type/auth';
import { BiscuitsError } from '@biscuits/error';

type Variables = {
	requestId: string;
	customDomain?: string;
	session: Session | null;
	sessionError?: BiscuitsError;
};

export type HonoEnv = { Bindings: Env; Variables: Variables };
