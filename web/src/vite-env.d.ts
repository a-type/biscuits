/// <reference types="vite/client" />

// env vars
declare global {
  interface ImportMetaEnv {
    VITE_STRIPE_PUBLISHABLE_KEY: string;
  }
}
