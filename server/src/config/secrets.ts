import { assert } from '@a-type/utils';

export const VERDANT_SECRET = process.env.VERDANT_SECRET!;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY!;

assert(!!VERDANT_SECRET, 'VERDANT_SECRET environment variable must be set');
assert(
  !!STRIPE_WEBHOOK_SECRET,
  'STRIPE_WEBHOOK_SECRET environment variable must be set',
);
assert(!!SESSION_SECRET, 'SESSION_SECRET environment variable must be set');
assert(
  !!OPENWEATHER_API_KEY,
  'OPENWEATHER_API_KEY environment variable must be set',
);
