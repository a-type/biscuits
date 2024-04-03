import { BiscuitsError } from '@biscuits/error';
import { initGraphQLTada } from 'gql.tada';
import { fetch } from './fetch.js';
import type { introspection } from './graphql-env.d.js';
import { CONFIG } from './index.js';
import {
  ApolloClient,
  InMemoryCache,
  useSuspenseQuery,
  from,
  useQuery,
} from '@apollo/client';
import { onError, ErrorHandler } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { HttpLink } from '@apollo/client/link/http';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    JSON: any;
  };
}>();

export { readFragment } from 'gql.tada';
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';

function createErrorHandler(onError?: (err: string) => void): ErrorHandler {
  return ({ graphQLErrors, networkError }) => {
    let errorMessage: string | undefined =
      'An unexpected error occurred. Please try again.';
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
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
    } else if (networkError) {
      console.error(networkError);
      errorMessage = 'A network error occurred. Please check your connection.';
    }

    onError?.(errorMessage);
  };
}

const createHttp = (origin: string) =>
  new HttpLink({
    fetch,
    credentials: 'include',
    uri: `${origin}/graphql`,
  });

const retry = new RetryLink({
  delay: {
    initial: 500,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      if (error.networkError) return true;

      return false;
    },
  },
});

export function createGraphQLClient({
  origin = CONFIG.API_ORIGIN,
  onError: errorHandler,
}: {
  origin?: string;
  onError?: (error: string) => void;
} = {}) {
  const http = createHttp(origin);
  return new ApolloClient({
    uri: `${origin}/graphql`,
    cache: new InMemoryCache({}),
    link: from([
      onError(createErrorHandler(deduplicateErrors(errorHandler))),
      retry,
      http,
    ]),
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
  onError: errorHandler,
}: {
  origin?: string;
  onError?: (error: string) => void;
} = {}) {
  const http = createHttp(origin);
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([
      onError(createErrorHandler(deduplicateErrors(errorHandler))),
      http,
    ]),
  });
}

export {
  useApolloClient as useClient,
  useMutation,
  useQuery,
  useSubscription,
  useBackgroundQuery,
  useFragment,
  useLazyQuery,
  useLoadableQuery,
  useSuspenseQuery,
  useReactiveVar,
  useReadQuery,
  NetworkStatus,
  ApolloError,
  isApolloError as isClientError,
} from '@apollo/client';
export type {
  GraphQLRequest,
  UseBackgroundQueryResult,
  UseFragmentOptions,
  UseFragmentResult,
  UseLoadableQueryResult,
  UseReadQueryResult,
  UseSuspenseQueryResult,
  ErrorPolicy,
} from '@apollo/client';

// some minimal queries for common use
const meQuery = graphql(`
  query CommonMe {
    me {
      id
      name
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
  return useQuery(meQuery, {
    fetchPolicy: 'cache-first',
  });
}

export function useIsLoggedIn() {
  const result = useMe();
  return result.data?.me !== null;
}

export function useCanSync() {
  const result = useMe();
  return result?.data?.me?.plan?.canSync;
}

export function useIsOffline() {
  const { error } = useMe();
  return !!error?.networkError;
}
