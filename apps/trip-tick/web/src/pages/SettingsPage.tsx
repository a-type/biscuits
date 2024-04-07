import { PageContent } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { DarkModeToggle, usePageTitle } from '@biscuits/client';

export interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
  usePageTitle('Settings');
  return (
    <PageContent>
      <H1>Settings</H1>
      <div className="flex flex-col gap-4 my-6 mx-2">
        <DarkModeToggle />
      </div>
    </PageContent>
  );
}

export default SettingsPage;
