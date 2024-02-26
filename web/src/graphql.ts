import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env';
import {
  Client,
  cacheExchange,
  fetchExchange,
  errorExchange,
  CombinedError,
} from 'urql';
import { API_HOST_HTTP } from './config';
import toast from 'react-hot-toast';
import { retryExchange } from '@urql/exchange-retry';
import { fetch } from '@biscuits/client';
import { BiscuitsError } from '@biscuits/error';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    JSON: any;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';

async function handleError(error: CombinedError) {
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
          window.location.href = '/join';
        } else {
          errorMessage = err.message;
        }
      }
    }
  }

  if (errorMessage) toast.error(errorMessage);
}

const retry = retryExchange({
  retryIf: (error, operation) => {
    if (operation.context.retry) return true;
    if (error.networkError) return true;

    return false;
  },
});

export const client = new Client({
  url: `${API_HOST_HTTP}/graphql`,
  exchanges: [
    errorExchange({ onError: handleError }),
    cacheExchange,
    retry,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: 'include',
  },
  fetch: fetch,
  suspense: true,
});
