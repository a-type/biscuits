import { useHasServerAccess } from '@biscuits/client';
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

import { UserMenu, UserMenuItem } from '@biscuits/client/apps';

import { authorization } from '@wish-wash.biscuits/verdant';
import { useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<PageRoot>
			<PageContent>
				<PageFixedArea>
					<UserMenu
						style={{ alignSelf: 'end' }}
						extraItems={
							<Suspense>
								<ListMenuExtraItems />
							</Suspense>
						}
					/>
				</PageFixedArea>
				<ListsList />
				<PageNowPlaying>
					<CreateListButton align="center" emphasis="primary" />
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
		navigate({ to: `/${list.get('id')}`, search: { listId: list.get('id') } });
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
