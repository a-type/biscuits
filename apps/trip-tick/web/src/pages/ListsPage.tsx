import { AddListButton } from '@/components/lists/AddListButton.jsx';
import { ListsList } from '@/components/lists/ListsList.jsx';
import { PageContent, PageNowPlaying } from '@a-type/ui/components/layouts';

export interface ListsPageProps {}

export function ListsPage({}: ListsPageProps) {
  return (
    <PageContent>
      <ListsList />
      <PageNowPlaying unstyled>
        <AddListButton>New list</AddListButton>
      </PageNowPlaying>
    </PageContent>
  );
}

export default ListsPage;
