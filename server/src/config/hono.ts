import type { HttpBindings } from '@hono/node-server';

type Variables = {
	requestId: string;
};

export type Env = { Bindings: HttpBindings; Variables: Variables };
