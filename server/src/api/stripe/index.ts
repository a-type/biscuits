import { raw, Router } from 'express';
import { webhookHandler } from './webhook.js';

const stripeRouter: Router = Router();

stripeRouter.post(
  '/webhook',
  raw({ type: 'application/json' }),
  webhookHandler,
);

export default stripeRouter;
