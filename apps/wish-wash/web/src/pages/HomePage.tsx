import { ListMenu } from '@/components/lists/ListMenu.jsx';
import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
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
      navigate(`/${lastList || someList!.get('id')}${window.location.search}`, {
        replace: true,
        skipTransition: true,
      });
    }
  }, [navigate, lastList, someList]);

  return (
    <PageContent>
      <PageFixedArea className="items-end">
        <ListMenu />
      </PageFixedArea>
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
        You might have deleted all your lists. You can create a new one with the{' '}
        <Icon name="dots" /> menu.
      </P>
    </div>
  );
}
