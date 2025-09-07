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
