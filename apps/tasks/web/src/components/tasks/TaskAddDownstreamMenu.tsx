import { hooks } from '@/hooks.js';
import { Button, ButtonProps, Dialog, DropdownMenu, Icon } from '@a-type/ui';
import { Task } from '@tasks.biscuits/verdant';
import { useState } from 'react';
import { TaskQuickAdd } from './TaskQuickAdd.jsx';

export interface TaskAddDownstreamMenuProps extends ButtonProps {
	task: Task;
}

export function TaskAddDownstreamMenu({
	task,
	children,
	...rest
}: TaskAddDownstreamMenuProps) {
	const { blocks } = hooks.useWatch(task);
	const [showNewModal, setShowNewModal] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenu.Trigger render={<Button {...rest} />}>
					{children ?? (
						<>
							<Icon name="plus" />
							Follow up
						</>
					)}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item onClick={() => setShowNewModal(true)}>
						New task
					</DropdownMenu.Item>
					<DropdownMenu.Item disabled>
						Pick existing task (todo)
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu>
			<Dialog open={showNewModal} onOpenChange={setShowNewModal}>
				<Dialog.Content>
					<Dialog.Title>New Task</Dialog.Title>
					<TaskQuickAdd
						onCreate={(created) => {
							blocks.add(created.get('id'));
							setShowNewModal(false);
						}}
					/>
				</Dialog.Content>
			</Dialog>
		</>
	);
}
