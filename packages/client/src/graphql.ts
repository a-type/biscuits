import { BiscuitsError } from '@biscuits/error';
import { refocusExchange } from '@urql/exchange-refocus';
import { retryExchange } from '@urql/exchange-retry';
import { initGraphQLTada } from 'gql.tada';
import {
  Client,
  cacheExchange,
  errorExchange,
  fetchExchange,
  useQuery,
  type CombinedError,
} from 'urql';
import { fetch } from './fetch.js';
import type { introspection } from './graphql-env.d.js';
import { CONFIG } from './index.js';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    JSON: any;
  };
}>();

export { readFragment } from 'gql.tada';
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';

function createErrorHandler(onError?: (err: string) => void) {
  return async function handleError(error: CombinedError) {
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
  origin = CONFIG.API_ORIGIN,
  onError,
}: {
  origin?: string;
  onError?: (error: string) => void;
} = {}) {
  return new Client({
    url: `${origin}/graphql`,
    exchanges: [
      refocus,
      errorExchange({
        onError: createErrorHandler(deduplicateErrors(onError)),
      }),
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

function deduplicateErrors(onError?: (error: string) => void) {
  if (!onError) return undefined;
  // only show 1 of each error message within a time window
  const errors = new Set<string>();
  return (error: string) => {
    if (errors.has(error)) return;
    errors.add(error);
    setTimeout(() => {
      errors.delete(error);
    }, 5000);
    onError(error);
  };
}

export function createMinimalGraphQLClient({
  origin = CONFIG.API_ORIGIN,
  onError,
}: {
  origin?: string;
  onError?: (error: string) => void;
} = {}) {
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

export {
  CombinedError,
  useClient,
  useMutation,
  useQuery,
  useSubscription,
} from 'urql';
export type {
  AnyVariables,
  CacheOutcome,
  ClientOptions,
  GraphQLRequest,
  Query,
  QueryProps,
  QueryState,
  UseQueryResponse,
} from 'urql';

// some minimal queries for common use
const meQuery = graphql(`
  query CommonMe {
    me {
      id
      plan {
        id
        canSync
        subscriptionStatus
        featureFlags
      }
    }
  }
`);

export function useMe() {
  return useQuery({
    query: meQuery,
    requestPolicy: 'cache-first',
  });
}

export function useIsLoggedIn() {
  const [result] = useMe();
  return [result.data?.me != null, result.fetching] as const;
}

export function useCanSync() {
  const [result] = useMe();
  return result?.data?.me?.plan?.canSync;
}

export function useIsOffline() {
  const [result] = useMe();
  return !result.fetching && !result.stale && result.error;
}
