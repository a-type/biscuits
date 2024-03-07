import { createGraphQLClient } from '@biscuits/client';
import { toast } from 'react-hot-toast';

export const graphqlClient = createGraphQLClient({
  onError: (err) => toast.error(err),
});
