import { ListEdit } from '@/components/groceries/lists/ListEdit.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { RecipeSavePrompt } from '@/components/recipes/savePrompt/RecipeSavePrompt.jsx';
import { OfflineIndicator } from '@/components/sync/OfflineIndicator.jsx';
import { RecipePresenceNotification } from '@/components/sync/collaborationMenu/RecipePresenceNotification.jsx';
import { ListContext } from '@/contexts/ListContext.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import {
  AddBar,
  List,
  ListSelectWrapper,
  ThemedPageContent,
  TopControls,
  UnknownListRedirect,
} from '@/pages/groceries/layout.jsx';
import {
  ChangelogDisplay,
  InstallButton,
  SubscribedOnly,
  SubscriptionExpiredDialog,
  UserMenu,
  PresencePeople,
} from '@biscuits/client';
import { useNavigate, useParams } from '@verdant-web/react-router';
import { Suspense, useCallback, useEffect } from 'react';

export function GroceriesPage() {
  const navigate = useNavigate();

  usePageTitle('Groceries');

  const onListChange = useCallback(
    (listId: string | null | undefined) => {
      if (listId === undefined) {
        navigate('/');
      } else if (listId === null) {
        navigate('/list/null');
      } else {
        navigate(`/list/${listId}`);
      }
    },
    [navigate],
  );
  const { listId: listIdParam } = useParams();
  const listId = listIdParam === 'null' ? null : listIdParam;

  const start = firstTimeOnboarding.useBegin();
  useEffect(() => {
    start();
  }, [start]);

  return (
    <ListContext.Provider value={listId}>
      <RecipeSavePrompt />
      <ThemedPageContent listId={listId}>
        <TopControls>
          <ListSelectWrapper>
            <ListSelect includeAll value={listId} onChange={onListChange} />
            {listId && <ListEdit listId={listId} />}
          </ListSelectWrapper>

          <div className="flex flex-row gap-2 items-center">
            <Suspense>
              <ChangelogDisplay className="sm:hidden" hideOnSeen />
            </Suspense>
            <InstallButton />
            <UserMenu>
              <Suspense>
                <PresencePeople />
              </Suspense>
            </UserMenu>
            <OfflineIndicator />
          </div>
        </TopControls>
        <AddBar />
        <List />
        <SubscriptionExpiredDialog />
        <UnknownListRedirect listId={listId} />
        <RecipePresenceNotification />
      </ThemedPageContent>
    </ListContext.Provider>
  );
}
