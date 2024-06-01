import { proxy } from 'valtio';

export const mode = proxy({
  value: 'default' as 'default' | 'edit-task',
});
