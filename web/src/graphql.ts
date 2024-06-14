export { graphql, type FragmentOf, readFragment } from '@biscuits/client';
import { createGraphQLClient } from '@biscuits/client';
import { toast } from '@a-type/ui';

export const client = createGraphQLClient({
  onError: (err) => {
    toast.error(err);
  },
  onLoggedOut: () => {
    if (
      window.location.pathname !== '/' &&
      window.location.pathname !== '/join'
    ) {
      // redirect to login
      window.location.href = '/login';
    }
  },
});
