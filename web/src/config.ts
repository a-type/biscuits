export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'localhost:6124';
export const SECURE =
  typeof window !== 'undefined' && window.location.protocol === 'https:';
export const API_HOST_HTTP = (SECURE ? 'https://' : 'http://') + API_ORIGIN;
export const API_HOST_WS = (SECURE ? 'wss://' : 'ws://') + API_ORIGIN;
export const UI_HOST_HTTP = import.meta.env.VITE_PUBLIC_URL;

export const FOR_TWO_PRICE_ID = import.meta.env
  .VITE_STRIPE_FOR_TWO_PLAN_PRICE_ID;
export const FAMILY_STYLE_PRICE_ID = import.meta.env
  .VITE_STRIPE_FAMILY_PLAN_PRICE_ID;
