import {
  NavigationTab,
  NavigationTabsRoot,
} from '@/components/nav/NavigationTabs.jsx';
import { PageContent } from '@a-type/ui/components/layouts';
import { TabsList, TabsRoot } from '@a-type/ui/components/tabs';
import { Outlet, useNavigate } from '@verdant-web/react-router';
import { useEffect } from 'react';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/trips');
  }, [navigate]);
  return (
    <PageContent>
      <NavigationTabsRoot>
        <TabsList>
          <NavigationTab value="/trips">Trips</NavigationTab>
          <NavigationTab value="/lists">Lists</NavigationTab>
        </TabsList>
      </NavigationTabsRoot>
    </PageContent>
  );
}

export default HomePage;
