export const SECURE =
  typeof window !== 'undefined' && window.location.protocol === 'https:';
export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN || 'http://localhost:6124';
export const HOME_ORIGIN =
  import.meta.env.VITE_HOME_ORIGIN || 'http://localhost:6123';

declare global {
  interface ImportMetaEnv {
    VITE_API_ORIGIN: string;
    VITE_HOME_ORIGIN: string;
    DEV: boolean;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
