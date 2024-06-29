import { CreateListButton } from '@/components/lists/CreateListButton.jsx';
import { hooks } from '@/store.js';
import { PageContent } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import { useLocalStorage } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';
import { useEffect } from 'react';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
  const [lastList] = useLocalStorage<string | null>('last-list', null);
  const someList = hooks.useOneList();
  const navigate = useNavigate();

  useEffect(() => {
    if (lastList || someList) {
      navigate(
        `/list/${lastList || someList!.get('id')}${window.location.search}`,
        {
          replace: true,
          skipTransition: true,
        },
      );
    }
  }, [navigate, lastList, someList]);

  return (
    <PageContent>
      <EmptyContent />
    </PageContent>
  );
}

export default HomePage;

function EmptyContent() {
  return (
    <div className="col">
      <H1>No lists!</H1>
      <P>
        You might have deleted all your lists. You can create a new one below.
      </P>
      <CreateListButton />
    </div>
  );
}
