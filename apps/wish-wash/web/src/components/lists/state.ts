import { proxy } from 'valtio';

export const createdItemState = proxy({
  justCreatedId: null as string | null,
});
