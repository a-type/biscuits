import { assert } from '@a-type/utils';
import { loadStripe } from '@stripe/stripe-js';

assert(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  'Missing VITE_STRIPE_PUBLISHABLE_KEY',
);
export const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

declare global {
  interface ImportMetaEnv {
    VITE_STRIPE_PUBLISHABLE_KEY: string;
  }
}
