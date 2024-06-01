import { hooks } from '@/store.js';

export function useBlockCount(taskId: string) {
  const sourced = hooks.useAllConnections({
    index: {
      where: 'sourceTaskId',
      equals: taskId,
    },
  });

  return sourced.length;
}
