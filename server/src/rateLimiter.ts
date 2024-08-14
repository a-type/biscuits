import { RequestHandler } from 'itty-router';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

export const rateLimiter = new RateLimiterMemory({
  points: 50,
  duration: 5,
});

export const rateLimit: RequestHandler = async (req) => {
  try {
    await rateLimiter.consume(req.url, 1);
  } catch (err) {
    return new Response('Too Many Requests', {
      status: 429,
    });
  }
};

export function toHeaders(rateLimit: RateLimiterRes) {
  return {
    'X-RateLimit-Limit': rateLimit.consumedPoints + rateLimit.remainingPoints,
    'X-RateLimit-Remaining': rateLimit.remainingPoints,
    'X-RateLimit-Reset': new Date(Date.now() + rateLimit.msBeforeNext),
    'Retry-After': rateLimit.msBeforeNext / 1000,
  };
}
