export { graphql, type FragmentOf, readFragment } from '@biscuits/client';
import { createGraphQLClient } from '@biscuits/client';
import { API_HOST_HTTP } from './config.js';
import { toast } from 'react-hot-toast';

export const client = createGraphQLClient({
  origin: API_HOST_HTTP,
  onError: toast.error.bind(toast),
});
