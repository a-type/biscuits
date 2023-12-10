export const API_ORIGIN =
  import.meta.env.NEXT_APP_API_ORIGIN || 'localhost:3001';
export const SECURE =
  typeof window !== 'undefined' && window.location.protocol === 'https:';
export const API_HOST_HTTP = (SECURE ? 'https://' : 'http://') + API_ORIGIN;
export const API_HOST_WS = (SECURE ? 'wss://' : 'ws://') + API_ORIGIN;
export const UI_HOST_HTTP = import.meta.env.NEXT_APP_PUBLIC_URL;

export const PRICE_MONTHLY_DOLLARS = 4;
export const PRICE_YEARLY_DOLLARS = 48;
