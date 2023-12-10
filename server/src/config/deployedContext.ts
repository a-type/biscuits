export const DEPLOYED_HOST =
  process.env.HOST || `http://127.0.0.1:${process.env.PORT ?? '6124'}`;
export const UI_ORIGIN = process.env.UI_ORIGIN || 'http://127.0.0.1:6123';
export const PORT = process.env.PORT || DEPLOYED_HOST.split(':')[2];
