import { hooks } from '@/hooks.js';
import {
	Button,
	ButtonProps,
	DropdownMenu,
	DropdownMenuArrow,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemRightSlot,
	DropdownMenuTrigger,
	Icon,
} from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';
import { authorization } from '@wish-wash.biscuits/verdant';

export interface ListMenuProps extends ButtonProps {}

export function ListMenu(props: ListMenuProps) {
	const client = hooks.useClient();

	const navigate = useNavigate();
	const createList = async (isPrivate?: boolean) => {
		const list = await client.lists.put(
			{ name: 'Wish list' },
			{
				access: isPrivate ? authorization.private : authorization.public,
			},
		);
		navigate(`/${list.get('id')}?listId=${list.get('id')}`);
	};

	const canSync = useHasServerAccess();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button emphasis="ghost" {...props} />}>
				<Icon name="dots" />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuArrow />
				{canSync && (
					<DropdownMenuItem onClick={() => createList(false)}>
						New public list
						<DropdownMenuItemRightSlot>
							<Icon name="add_person" />
						</DropdownMenuItemRightSlot>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={() => createList(true)}>
					New private list
					<DropdownMenuItemRightSlot>
						<Icon name="plus" />
					</DropdownMenuItemRightSlot>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
