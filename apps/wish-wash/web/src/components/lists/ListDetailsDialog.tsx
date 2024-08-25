import { hooks } from '@/hooks.js';
import { toast } from '@a-type/ui';
import { Button, ConfirmedButton } from '@a-type/ui/components/button';
import { Dialog, DialogClose } from '@a-type/ui/components/dialog';
import { DropdownMenuItemRightSlot } from '@a-type/ui/components/dropdownMenu';
import {
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui/components/forms';
import { Icon } from '@a-type/ui/components/icon';
import { Tabs } from '@a-type/ui/components/tabs';
import { UserMenuItem } from '@biscuits/client';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';
import { authorization } from '@wish-wash.biscuits/verdant';
import { useEditList } from './hooks.js';

export interface ListDetailsDialogProps {}

export function ListDetailsDialog({}: ListDetailsDialogProps) {
	const [params, setParams] = useSearchParams();
	const listId = params.get('listId');

	const list = hooks.useList(listId || '', { skip: !listId });
	hooks.useWatch(list);

	const onClose = () => {
		setParams((p) => {
			p.delete('listId');
			return p;
		});
	};

	const navigate = useNavigate();
	const deleteList = async () => {
		if (list) {
			list.deleteSelf();
			toast.success('List deleted');
			navigate('/');
		}
	};

	const client = hooks.useClient();
	const convertToShared = async () => {
		if (list) {
			if (!list.isAuthorized) {
				return;
			}
			const converted = await client.lists.clone(list, {
				access: authorization.public,
				undoable: false,
			});
			list.deleteSelf();
			navigate(`/${converted.get('id')}`);
		}
	};
	const convertToPrivate = async () => {
		if (list) {
			if (list.isAuthorized) {
				return;
			}
			const converted = await client.lists.clone(list, {
				access: authorization.private,
				undoable: false,
			});
			list.deleteSelf();
			navigate(`/${converted.get('id')}`);
		}
	};

	const isPrivate = list?.isAuthorized;

	return (
		<Dialog
			open={!!listId}
			onOpenChange={(v) => {
				if (!v) onClose();
			}}
		>
			<Dialog.Content>
				<Dialog.Title>Manage list</Dialog.Title>
				<Dialog.Actions>
					{isPrivate ?
						<ConfirmedButton
							confirmText="This will make all items visible to other plan members."
							onConfirm={convertToShared}
						>
							Convert to shared list
						</ConfirmedButton>
					:	<ConfirmedButton
							confirmText="This will make this list inaccessible to other plan members."
							onConfirm={convertToPrivate}
						>
							Convert to private list
						</ConfirmedButton>
					}
					<Button
						type="button"
						color="destructive"
						onClick={deleteList}
						className="mr-auto"
					>
						<Icon name="trash" />
						Delete list
					</Button>
					<Dialog.Close>Cancel</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}

export interface ListDetailsEditButtonProps {
	listId: string;
	className?: string;
}

export function ListDetailsEditButton({
	listId,
	...rest
}: ListDetailsEditButtonProps) {
	const editList = useEditList();
	return (
		<UserMenuItem onClick={() => editList(listId)} {...rest}>
			Edit list{' '}
			<DropdownMenuItemRightSlot>
				<Icon name="pencil" />
			</DropdownMenuItemRightSlot>
		</UserMenuItem>
	);
}
