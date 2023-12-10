export const DEPLOYED_HOST = process.env.HOST || 'http://localhost:4445';
export const UI_ORIGIN = process.env.UI_ORIGIN || 'http://localhost:8080';
export const PORT = process.env.PORT || DEPLOYED_HOST.split(':')[2];
