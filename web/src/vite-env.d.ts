/// <reference types="vite/client" />

// env vars
declare global {
  interface ImportMetaEnv {
    VITE_STRIPE_PUBLISHABLE_KEY: string;
    VITE_FOR_TWO_PRICE_ID: string;
    VITE_FAMILY_STYLE_PRICE_ID: string;
  }
}
