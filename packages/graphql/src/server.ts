import { initGraphQLTada } from 'gql.tada';
import { introspection } from './graphql-env.js';

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
