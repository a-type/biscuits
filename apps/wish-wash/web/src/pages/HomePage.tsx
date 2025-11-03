import { CreateListButton } from '@/components/lists/CreateListButton.jsx';
import { ListsList } from '@/components/lists/ListsList.jsx';
import { hooks } from '@/hooks.js';
import {
	DropdownMenuItemRightSlot,
	Icon,
	PageContent,
	PageFixedArea,
	PageNowPlaying,
	PageRoot,
} from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
import { UserMenu, UserMenuItem } from '@biscuits/client/apps';
import { useNavigate } from '@verdant-web/react-router';
import { authorization } from '@wish-wash.biscuits/verdant';
import { Suspense } from 'react';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<PageRoot>
			<PageContent>
				<PageFixedArea className="items-end">
					<UserMenu
						extraItems={
							<Suspense>
								<ListMenuExtraItems />
							</Suspense>
						}
					/>
				</PageFixedArea>
				<ListsList />
				<PageNowPlaying unstyled>
					<CreateListButton
						className="self-center shadow-lg"
						emphasis="primary"
					/>
				</PageNowPlaying>
			</PageContent>
		</PageRoot>
	);
}

export default HomePage;

export function ListMenuExtraItems() {
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
		<>
			{canSync && (
				<UserMenuItem onClick={() => createList(false)}>
					New public list
					<DropdownMenuItemRightSlot>
						<Icon name="add_person" />
					</DropdownMenuItemRightSlot>
				</UserMenuItem>
			)}
			<UserMenuItem onClick={() => createList(true)}>
				New private list
				<DropdownMenuItemRightSlot>
					<Icon name="plus" />
				</DropdownMenuItemRightSlot>
			</UserMenuItem>
		</>
	);
}
