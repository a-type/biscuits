import { createMiddleware } from 'hono/factory';
import { Env } from '../config/ctx.js';

export const requestIdMiddleware = createMiddleware<Env>(async function (
  ctx,
  next,
) {
  const requestId =
    ctx.req.header('x-request-id') ?? Math.random().toString(36).substring(7);
  ctx.set('requestId', requestId);
  ctx.res.headers.set('x-request-id', requestId);
  await next();
});
