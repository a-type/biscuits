export enum BiscuitsErrorCode {
	BadRequest = 4000,
	UnrecognizedApp = 4001,
	Unauthorized = 4010,
	NotLoggedIn = 4011,
	SessionExpired = 4012,
	// requires re-login
	SessionInvalid = 4013,
	Forbidden = 4030,
	NoPlan = 4031,
	SubscriptionInactive = 4032,
	PlanFull = 4033,
	NotFound = 4040,
	Conflict = 4090,
	RateLimited = 4290,
	Unexpected = 5000,
}

export class BiscuitsError extends Error {
	static Code = BiscuitsErrorCode;

	static readResponse(response: Response) {
		const code = response.headers.get('x-biscuits-error');
		const message = response.headers.get('x-biscuits-message');
		if (code && message) {
			return new BiscuitsError(parseInt(code), message);
		}
		return null;
	}

	static readResponseBody(body: unknown) {
		let parsed: any = body;
		if (typeof body === 'string') {
			parsed = JSON.parse(body);
		}
		if ('code' in parsed && 'message' in parsed) {
			return new BiscuitsError(parsed.code, parsed.message);
		}
		return null;
	}

	static isInstance(err: unknown): err is BiscuitsError {
		return (
			err instanceof BiscuitsError || (err as any)?.isBiscuitsError === true
		);
	}

	public code: BiscuitsErrorCode;
	public message: string;
	public readonly isBiscuitsError = true;

	constructor(code: BiscuitsErrorCode, message?: string, cause?: unknown) {
		super(message, {
			cause,
		});
		this.name = 'BiscuitsError';
		this.code = code;
		this.message = message || `BiscuitsError: ${code}`;
	}

	get statusCode() {
		return Math.floor(this.code / 10);
	}

	get body() {
		return { code: this.code, message: this.message };
	}

	get headers() {
		return {
			'x-biscuits-error': this.code.toString(),
			'x-biscuits-message': this.message,
		};
	}
}
