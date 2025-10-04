import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

export const rateLimiter = new RateLimiterMemory({
	points: 50,
	duration: 5,
});

export function toHeaders(rateLimit: RateLimiterRes) {
	return {
		'X-RateLimit-Limit': rateLimit.consumedPoints + rateLimit.remainingPoints,
		'X-RateLimit-Remaining': rateLimit.remainingPoints,
		'X-RateLimit-Reset': new Date(Date.now() + rateLimit.msBeforeNext),
		'Retry-After': rateLimit.msBeforeNext / 1000,
	};
}
