import type { AppRouter } from '@biscuits/trpc';
import {
  TRPCClientError,
  createTRPCProxyClient,
  httpBatchLink,
} from '@trpc/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const createClient = ({ baseUrl }: { baseUrl: string }) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${baseUrl}/trpc`,
        fetch(url, options) {
          // @ts-expect-error
          return window.fetch(url, {
            ...options,
            credentials: 'include',
          });
        },
      }),
    ],
  });

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export function isClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
