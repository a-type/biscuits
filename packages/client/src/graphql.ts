import {
  ApolloClient,
  InMemoryCache,
  NetworkStatus,
  from,
  useQuery,
} from '@apollo/client';
import { ErrorHandler, onError } from '@apollo/client/link/error';
import { HttpLink } from '@apollo/client/link/http';
import { RetryLink } from '@apollo/client/link/retry';
import { BiscuitsError } from '@biscuits/error';
import { initGraphQLTada } from 'gql.tada';
import { fetch } from './fetch.js';
import type { introspection } from './graphql-env.d.js';
import { CONFIG, refreshSession } from './index.js';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    Date: string;
    JSON: any;
  };
}>();

export { maskFragments, readFragment } from 'gql.tada';
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';

function createErrorHandler(
  onError?: (err: string) => void,
  onLoggedOut?: () => void,
): ErrorHandler {
  return ({ graphQLErrors, networkError, operation, forward }) => {
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
            errorMessage = undefined;
            operation.setContext(async () => {
              // attempt to refresh the session
              console.log('Attempting to refresh session');
              const success = await refreshSession(CONFIG.API_ORIGIN);
              console.log('Refresh session succeeded:', success);
              if (success) {
                // retry the original request
                return forward(operation);
              } else {
                console.error('Failed to refresh session');
                // failed to refresh the session - the user needs
                // to log in to use this query.
                onLoggedOut?.();
                return;
              }
            });
          } else {
            errorMessage = err.message;
          }
        }
      }
    } else if (networkError) {
      if ('statusCode' in networkError && networkError.statusCode === 401) {
        errorMessage = undefined;
        operation.setContext(async () => {
          // attempt to refresh the session
          console.log('Attempting to refresh session');
          const success = await refreshSession(CONFIG.API_ORIGIN);
          console.log('Refresh session succeeded:', success);
          if (success) {
            // retry the original request
            return forward(operation);
          } else {
            console.error('Failed to refresh session');
            // failed to refresh the session - the user needs
            // to log in to use this query.
            onLoggedOut?.();
            return;
          }
        });
      } else {
        console.error(networkError);
        errorMessage =
          'A network error occurred. Please check your connection.';
      }
    }

    if (errorMessage && !operation.getContext().hideErrors)
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
  onLoggedOut,
}: {
  origin?: string;
  onError?: (error: string) => void;
  onLoggedOut?: () => void;
} = {}) {
  const http = createHttp(origin);
  return new ApolloClient({
    uri: `${origin}/graphql`,
    cache: new InMemoryCache({}),
    link: from([
      onError(createErrorHandler(deduplicateErrors(errorHandler), onLoggedOut)),
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
  onLoggedOut,
}: {
  origin?: string;
  onError?: (error: string) => void;
  onLoggedOut?: () => void;
} = {}) {
  const http = createHttp(origin);
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([
      onError(createErrorHandler(deduplicateErrors(errorHandler), onLoggedOut)),
      http,
    ]),
  });
}

export {
  ApolloError,
  NetworkStatus,
  isApolloError as isClientError,
  useBackgroundQuery,
  useApolloClient as useClient,
  useFragment,
  useLazyQuery,
  useLoadableQuery,
  useMutation,
  useQuery,
  useReactiveVar,
  useReadQuery,
  useSubscription,
  useSuspenseQuery,
} from '@apollo/client';
export type {
  ErrorPolicy,
  GraphQLRequest,
  UseBackgroundQueryResult,
  UseFragmentOptions,
  UseFragmentResult,
  UseLoadableQueryResult,
  UseReadQueryResult,
  UseSuspenseQueryResult,
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
  // ignore if network error
  const networkError = !!result.error?.networkError;
  return [
    !!result.data?.me?.id,
    result.networkStatus === NetworkStatus.loading ||
      result.networkStatus === NetworkStatus.refetch ||
      networkError,
  ];
}

export function useCanSync() {
  const result = useMe();
  return result?.data?.me?.plan?.canSync;
}

export function useIsOffline() {
  const { error } = useMe();
  return !!error?.networkError;
}
