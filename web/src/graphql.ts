import { createGraphQLClient } from '@biscuits/graphql';
import { toast } from '@a-type/ui';

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
