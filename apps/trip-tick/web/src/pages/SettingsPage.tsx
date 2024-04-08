import { PageContent } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { DarkModeToggle, ResetToServer, usePageTitle } from '@biscuits/client';
import { AutoRestoreScroll } from '@verdant-web/react-router';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
  usePageTitle('Settings');
  return (
    <PageContent>
      <H1>Settings</H1>
      <div className="flex flex-col gap-4 my-6 mx-2">
        <DarkModeToggle />
        <ResetToServer />
      </div>
      <AutoRestoreScroll />
    </PageContent>
  );
}

export default SettingsPage;
