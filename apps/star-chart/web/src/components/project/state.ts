import { proxy } from 'valtio';

export const projectState = proxy({
  activeConnectionTarget: null as string | null,
});
