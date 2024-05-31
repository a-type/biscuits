import { Task } from '@star-chart.biscuits/verdant';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItemRightSlot,
} from '@a-type/ui/components/dropdownMenu';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { hooks } from '@/store.js';

export interface TaskMenuProps {
  task: Task;
  className?: string;
}

export function TaskMenu({ task, className, ...rest }: TaskMenuProps) {
  const client = hooks.useClient();
  const id = task.get('id');
  const deleteTask = async () => {
    // delete all connections to and from this task
    const sourcedConnections = await client.connections.findAll({
      index: {
        where: 'sourceTaskId',
        equals: id,
      },
    }).resolved;
    const targetConnections = await client.connections.findAll({
      index: {
        where: 'targetTaskId',
        equals: id,
      },
    }).resolved;
    await Promise.all([
      ...sourcedConnections.map((connection) =>
        client.connections.delete(connection.get('id')),
      ),
      ...targetConnections.map((connection) =>
        client.connections.delete(connection.get('id')),
      ),
      client.tasks.delete(id),
    ]);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className} {...rest}>
        <Button size="icon" color="ghost">
          <Icon name="dots" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem color="destructive" onClick={deleteTask}>
          <span>Delete</span>
          <DropdownMenuItemRightSlot>
            <Icon name="trash" />
          </DropdownMenuItemRightSlot>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
