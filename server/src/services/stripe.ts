import { assert } from '@a-type/utils';
import Stripe from 'stripe';

assert(process.env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY is required');

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
