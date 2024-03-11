import { AddListButton } from '@/components/lists/AddListButton.jsx';
import { ListsList } from '@/components/lists/ListsList.jsx';
import { H1 } from '@a-type/ui/components/typography';
import { PageContent, PageNowPlaying } from '@a-type/ui/components/layouts';
import { UserMenu } from '@biscuits/client';

export interface ListsPageProps {}

export function ListsPage({}: ListsPageProps) {
  return (
    <PageContent>
      <div className="flex flex-row justify-between items-center mb-4">
        <H1>Lists</H1>
        <UserMenu className="ml-auto" />
      </div>
      <ListsList />
      <PageNowPlaying unstyled>
        <AddListButton>New list</AddListButton>
      </PageNowPlaying>
    </PageContent>
  );
}

export default ListsPage;
