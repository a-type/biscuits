'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loggerLink, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';

import type { AppRouter } from '@biscuits/trpc';

export const client = createTRPCReact<AppRouter>();

export function ClientProvider(props: {
  children: React.ReactNode;
  baseUrl: string;
}) {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    client.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchLink({
          url: props.baseUrl + '/trpc',
          fetch: (input, init) =>
            // @ts-expect-error
            fetch(input, { ...init, credentials: 'include' }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <client.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </client.Provider>
    </QueryClientProvider>
  );
}
