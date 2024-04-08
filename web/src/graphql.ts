export { graphql, type FragmentOf, readFragment } from '@biscuits/client';
import { createGraphQLClient } from '@biscuits/client';
import { toast } from 'react-hot-toast';

export const client = createGraphQLClient({
  onError: (err) => {
    toast.error(err);
  },
  onLoggedOut: () => {
    // redirect to login
    window.location.href = '/login';
  },
});
