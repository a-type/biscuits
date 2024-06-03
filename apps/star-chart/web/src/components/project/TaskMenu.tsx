import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { Task } from '@star-chart.biscuits/verdant';
import { useDeleteTask } from './hooks.js';
import { clsx } from '@a-type/ui';

export interface TaskMenuProps {
  task: Task;
  className?: string;
}

export function TaskMenu({ task, className, ...rest }: TaskMenuProps) {
  const id = task.get('id');
  const deleteTask = useDeleteTask();

  return (
    <div className={clsx('row justify-end', className)} {...rest}>
      <Button
        size="icon"
        color="ghostDestructive"
        onClick={() => deleteTask(id)}
      >
        <Icon name="trash" />
      </Button>
    </div>
  );
}
