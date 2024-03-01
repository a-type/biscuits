export enum BiscuitsErrorCode {
  BadRequest = 4000,
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
  Unexpected = 5000,
}

export class BiscuitsError extends Error {
  static Code = BiscuitsErrorCode;

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
}
