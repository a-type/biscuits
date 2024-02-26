export const DEPLOYED_ORIGIN =
  process.env.HOST || `http://localhost:${process.env.PORT ?? '6124'}`;
export const UI_ORIGIN = process.env.UI_ORIGIN || 'http://localhost:6123';
export const PORT = process.env.PORT || DEPLOYED_ORIGIN.split(':')[2];
export const ENVIRONMENT = process.env.NODE_ENV || 'development';
