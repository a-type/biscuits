import { TemperatureUnitSelect } from '@/components/weather/TemperatureUnit.jsx';
import { clientDescriptor } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { DarkModeToggle, usePageTitle } from '@biscuits/client';
import { ManageStorage } from '@biscuits/client/storage';
import { AutoRestoreScroll, Link } from '@verdant-web/react-router';
import { toast } from 'react-hot-toast';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
  usePageTitle('Settings');
  return (
    <PageContent>
      <PageFixedArea className="row py-2">
        <Button asChild color="ghost">
          <Link to="/">
            <Icon name="arrowLeft" /> Back
          </Link>
        </Button>
      </PageFixedArea>
      <H1>Settings</H1>
      <div className="flex flex-col gap-4 my-6 mx-2 items-start">
        <DarkModeToggle />
        <TemperatureUnitSelect />
        <ManageStorage onError={(er) => toast.error(er.message)} />
      </div>
      <AutoRestoreScroll />
    </PageContent>
  );
}

export default SettingsPage;
