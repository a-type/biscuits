import { hooks } from '@/hooks.js';
import { ButtonProps, Button } from '@a-type/ui/components/button';
import {
	Card,
	CardContent,
	CardMain,
	CardTitle,
} from '@a-type/ui/components/card';
import {
	Dialog,
	DialogTrigger,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@a-type/ui/components/dialog';
import { Icon } from '@a-type/ui/components/icon';
import { useHasServerAccess } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';
import { authorization } from '@wish-wash.biscuits/verdant';
import { useState } from 'react';

export interface CreateListButtonProps extends ButtonProps {}

export function CreateListButton({
	children,
	...props
}: CreateListButtonProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	const canSync = useHasServerAccess();

	const [open, setOpen] = useState(false);

	const createPublic = async () => {
		const list = await client.lists.put({});
		navigate(`/${list.get('id')}?listId=${list.get('id')}`);
		setOpen(false);
	};
	const createPrivate = async () => {
		const list = await client.lists.put(
			{
				name: 'Wish list',
			},
			{
				access: authorization.private,
			},
		);
		navigate(`/${list.get('id')}?listId=${list.get('id')}`);
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (open) {
					if (!canSync) {
						createPrivate();
					} else {
						setOpen(true);
					}
				} else {
					setOpen(open);
				}
			}}
		>
			<Dialog.Trigger asChild>
				<Button {...props}>
					{children || (
						<>
							<Icon name="plus" />
							New List
						</>
					)}
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Create List</Dialog.Title>
				<Dialog.Description className="text-sm">
					This can be changed later
				</Dialog.Description>
				<div className="grid grid-cols-2 items-stretch justify-stretch gap-3">
					{canSync && (
						<Card className="h-full">
							<CardMain onClick={createPublic}>
								<CardTitle>
									<Icon name="add_person" /> Shared List
								</CardTitle>
								<CardContent>
									A collaborative list you share with everyone on your plan.
								</CardContent>
							</CardMain>
						</Card>
					)}
					<Card className="h-full">
						<CardMain onClick={createPrivate}>
							<CardTitle>
								<Icon name="lock" /> Private List
							</CardTitle>
							<CardContent>A list only you can see.</CardContent>
						</CardMain>
					</Card>
				</div>
				<Dialog.Actions>
					<Dialog.Close>Cancel</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
