import { assert } from '@a-type/utils';

export const VERDANT_SECRET = process.env.VERDANT_SECRET!;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY!;
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
export const GNOCCHI_HUB_CLOUDFRONT_ID = process.env.GNOCCHI_HUB_CLOUDFRONT_ID;
export const POST_HUB_CLOUDFRONT_ID = process.env.POST_HUB_CLOUDFRONT_ID;
export const WISH_WASH_HUB_CLOUDFRONT_ID =
	process.env.WISH_WASH_HUB_CLOUDFRONT_ID;
export const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
export const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

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
assert(
	TEST || !!CLOUDFLARE_API_TOKEN,
	'CLOUDFLARE_API_TOKEN environment variable must be set',
);
assert(
	TEST || !!CLOUDFLARE_ZONE_ID,
	'CLOUDFLARE_ZONE_ID environment variable must be set',
);
