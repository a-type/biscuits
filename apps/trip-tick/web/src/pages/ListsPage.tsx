import { AddListButton } from '@/components/lists/AddListButton.jsx';
import { ListsList } from '@/components/lists/ListsList.jsx';
import {
  NavigationTab,
  NavigationTabsRoot,
} from '@/components/nav/NavigationTabs.jsx';
import { RouteDialog } from '@/components/nav/RouteDialog.jsx';
import {
  PageContent,
  PageFixedArea,
  PageNowPlaying,
} from '@a-type/ui/components/layouts';
import { TabsList } from '@a-type/ui/components/tabs';

export interface ListsPageProps {}

export function ListsPage({}: ListsPageProps) {
  return (
    <PageContent>
      <ListsList />
      <RouteDialog />
      <PageNowPlaying unstyled>
        <AddListButton>New list</AddListButton>
      </PageNowPlaying>
    </PageContent>
  );
}

export default ListsPage;
