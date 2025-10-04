type Variables = {
	requestId: string;
	customDomain?: string;
};

export type HonoEnv = { Bindings: Env; Variables: Variables };
