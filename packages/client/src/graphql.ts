import { BiscuitsError } from '@biscuits/error';
import { refocusExchange } from '@urql/exchange-refocus';
import {
  type CombinedError,
  Client,
  cacheExchange,
  errorExchange,
  fetchExchange,
} from 'urql';
import { retryExchange } from '@urql/exchange-retry';
import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env.d.js';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    JSON: any;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';

function createErrorHandler(onError?: (err: string) => void) {
  return async function handleError(error: CombinedError) {
    console.error(error);
    let errorMessage: string | undefined =
      'An unexpected error occurred. Please try again.';
    if (error.graphQLErrors) {
      for (const err of error.graphQLErrors) {
        console.error(err);
        if (err.extensions?.biscuitsCode) {
          const code = err.extensions.biscuitsCode as number;
          if (
            code >= 4010 &&
            code < 4020 &&
            code !== BiscuitsError.Code.SessionExpired
          ) {
            const currentPath = window.location.pathname;
            window.location.href =
              '/join' + '?returnTo=' + encodeURIComponent(currentPath);
          } else {
            errorMessage = err.message;
          }
        }
      }
    }

    onError?.(errorMessage);
  };
}

const retry = retryExchange({
  retryIf: (error, operation) => {
    if (operation.context.retry) return true;
    if (error.networkError) return true;

    return false;
  },
});

const refocus = refocusExchange();

export function createGraphQLClient({
  origin,
  onError,
}: {
  origin: string;
  onError?: (error: string) => void;
}) {
  return new Client({
    url: `${origin}/graphql`,
    exchanges: [
      refocus,
      errorExchange({ onError: createErrorHandler(onError) }),
      cacheExchange,
      retry,
      fetchExchange,
    ],
    fetchOptions: {
      credentials: 'include',
    },
    fetch,
    suspense: true,
  });
}

export function createMinimalGraphQLClient({
  origin,
  onError,
}: {
  origin: string;
  onError?: (error: string) => void;
}) {
  return new Client({
    url: `${origin}/graphql`,
    exchanges: [
      errorExchange({ onError: createErrorHandler(onError) }),
      retry,
      fetchExchange,
    ],
    fetchOptions: {
      credentials: 'include',
    },
    fetch,
  });
}
