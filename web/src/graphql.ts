import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env';
import { Client, cacheExchange, fetchExchange } from 'urql';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    JSON: any;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';

export const client = new Client({
  url: `${process.env.API_HOST_HTTP}/graphql`,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    credentials: 'include',
  },
  suspense: true,
});
