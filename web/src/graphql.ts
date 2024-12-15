import { toast } from '@a-type/ui';
import { createGraphQLClient } from '@biscuits/graphql';

import { initGraphQLTada } from 'gql.tada';
import { introspection } from './graphql-env.js';

export { maskFragments, readFragment } from 'gql.tada';
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';

export const graphql = initGraphQLTada<{
	introspection: introspection;
	scalars: {
		DateTime: string;
		Date: string;
		JSON: any;
	};
}>();

export const client = createGraphQLClient({
	onError: (err) => {
		toast.error(err);
	},
	onLoggedOut: () => {
		if (window.location.pathname === '/plan') {
			// redirect to login
			window.location.href = '/login';
		}
	},
});
