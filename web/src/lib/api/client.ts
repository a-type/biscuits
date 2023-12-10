import { createClient } from '@biscuits/client';

export const server = createClient({
  baseUrl: import.meta.env.VITE_API_URL!,
});
