import { assert } from '@a-type/utils';

export const VERDANT_SECRET = process.env.VERDANT_SECRET!;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY!;
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

const TEST = process.env.TEST;

assert(
  TEST || !!VERDANT_SECRET,
  'VERDANT_SECRET environment variable must be set',
);
assert(
  TEST || !!STRIPE_WEBHOOK_SECRET,
  'STRIPE_WEBHOOK_SECRET environment variable must be set',
);
assert(
  TEST || !!SESSION_SECRET,
  'SESSION_SECRET environment variable must be set',
);
assert(
  TEST || !!OPENWEATHER_API_KEY,
  'OPENWEATHER_API_KEY environment variable must be set',
);
assert(
  TEST || !!GOOGLE_MAPS_API_KEY,
  'GOOGLE_MAPS_API_KEY environment variable must be set',
);
