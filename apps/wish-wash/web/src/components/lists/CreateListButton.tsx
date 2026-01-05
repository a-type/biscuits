import { Button, ButtonProps, Dialog, Icon } from '@a-type/ui';
import { useState } from 'react';
import { CreateListOptions } from './CreateListOptions.jsx';

export interface CreateListButtonProps extends ButtonProps {}

export function CreateListButton({
	children,
	...props
}: CreateListButtonProps) {
	const [open, setOpen] = useState(false);
	const [stage, setStage] = useState<'type' | 'who'>('type');

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger render={<Button {...props} />}>
				{children || (
					<>
						<Icon name="plus" />
						New List
					</>
				)}
			</Dialog.Trigger>
			<Dialog.Content>
				{stage === 'type' ?
					<>
						<Dialog.Title>What kind of list?</Dialog.Title>
						<Dialog.Description>
							Choose the type of list you want to create
						</Dialog.Description>
					</>
				:	<>
						<Dialog.Title>Who's it for?</Dialog.Title>
						<Dialog.Description>
							Enter the name of the person you're thinking of.
						</Dialog.Description>
					</>
				}
				<CreateListOptions
					onCreated={() => setOpen(false)}
					onStageChange={setStage}
				/>
				<Dialog.Actions>
					<Dialog.Close>Cancel</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
