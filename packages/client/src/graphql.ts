import { toast } from '@a-type/ui';
import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { ErrorHandler, onError } from '@apollo/client/link/error';
import { HttpLink } from '@apollo/client/link/http';
import { RetryLink } from '@apollo/client/link/retry';
import { BiscuitsError } from '@biscuits/error';
import { initGraphQLTada } from 'gql.tada';
import * as CONFIG from './config.js';
import { fetch, refreshSession } from './fetch.js';
import type { introspection } from './graphql-env.d.js';

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

let hasNetworkError = false;

function createErrorHandler(
  onError?: (err: string) => void,
  onLoggedOut?: () => void,
): ErrorHandler {
  return ({ graphQLErrors, networkError, operation, forward }) => {
    let errorMessage: string | undefined =
      'An unexpected error occurred. Please try again.';
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        console.error('Error during op', operation.operationName, err);
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
      } else if (!hasNetworkError) {
        hasNetworkError = true;
        console.error(networkError);
        if (networkError.message === 'Failed to fetch') {
          // errorMessage =
          //   'Having trouble reaching Biscuits servers. Running in offline mode.';
          // this is communicated through UserMenu
          errorMessage = undefined;
        } else {
          errorMessage =
            'A network error occurred. Please check your connection.';
        }
      } else {
        errorMessage = undefined;
      }
    }

    if (!networkError) {
      hasNetworkError = false;
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
    max: 10,
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

export const graphqlClient = createGraphQLClient({
  onError: toast.error,
});

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
