export const SECURE =
  typeof window !== 'undefined' && window.location.protocol === 'https:';
export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN || 'http://localhost:6124';
export const UI_ORIGIN = import.meta.env.VITE_PUBLIC_URL;

declare global {
  interface ImportMetaEnv {
    VITE_API_ORIGIN: string;
    VITE_PUBLIC_URL: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
