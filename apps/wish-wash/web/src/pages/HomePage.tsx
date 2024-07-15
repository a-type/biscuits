import { ListMenu } from '@/components/lists/ListMenu.jsx';
import { ListsList } from '@/components/lists/ListsList.jsx';
import { hooks } from '@/store.js';
import { DropdownMenuItemRightSlot } from '@a-type/ui/components/dropdownMenu';
import { Icon } from '@a-type/ui/components/icon';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { useCanSync, UserMenu, UserMenuItem } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';
import { authorization } from '@wish-wash.biscuits/verdant';
import { Suspense } from 'react';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
  return (
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
      <H1 className="gutter-bottom">Lists</H1>
      <ListsList />
    </PageContent>
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

  const canSync = useCanSync();

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
