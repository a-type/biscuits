import { Icon } from '@/components/icons/Icon.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { ManageCategoriesDialog } from '@/components/menu/ManageCategoriesDialog.jsx';
import { TextLink } from '@/components/nav/Link.jsx';
import { ReloadButton } from '@/components/sync/ReloadButton.jsx';
import { UpdatePrompt } from '@/components/updatePrompt/UpdatePrompt.jsx';
import { checkForUpdate } from '@/components/updatePrompt/updateState.js';
import { useInterval } from '@/hooks/useInterval.js';
import { Button } from '@a-type/ui/components/button';
import { Divider } from '@a-type/ui/components/divider';
import { PageContent } from '@a-type/ui/components/layouts';
import { H1, H2 } from '@a-type/ui/components/typography';
import {
  ManagePlanButton,
  InstallHint,
  LoginButton,
  LogoutButton,
  ResetToServer,
  ChangelogDisplay,
  PromoteSubscriptionButton,
  PushSubscriptionToggle,
  useIsLoggedIn,
  useCanSync,
  useIsOffline,
  useMe,
  DarkModeToggle,
} from '@biscuits/client';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { ReactNode, useEffect } from 'react';
import { groceriesDescriptor } from '@/stores/groceries/index.js';
import { VAPID_KEY } from '@/config.js';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';

const contents = {
  offline: OfflineContents,
  anonymous: AnonymousContents,
  unsubscribed: UnsubscribedContents,
  online: OnlineContents,
} as const;

export function PlanPage() {
  const offline = useIsOffline();
  const isLoggedIn = useIsLoggedIn();
  const canSync = useCanSync();

  let state: keyof typeof contents = 'online';
  if (offline) {
    state = 'offline';
  } else if (!isLoggedIn) {
    state = 'anonymous';
  } else if (!canSync) {
    state = 'unsubscribed';
  }

  const Contents = contents[state];

  useEffect(() => {
    checkForUpdate();
  }, []);

  return (
    <PageContent fullHeight noPadding>
      <div className="flex flex-col w-full mt-6 p-4 gap-4 items-start">
        <H1>Settings</H1>
        <UpdatePrompt />
        <Contents />
        <div className="text-xs flex flex-col gap-2">
          <ChangelogDisplay>
            <Button>
              <Icon name="gift" />
              <span>What&apos;s new</span>
            </Button>
          </ChangelogDisplay>
          <TextLink to="/privacy-policy">Privacy policy</TextLink>
          <TextLink to="/tos">Terms and conditions of use</TextLink>
        </div>
      </div>
      <AutoRestoreScroll />
    </PageContent>
  );
}

export default PlanPage;

const MainContainer = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col items-start w-full gap-4">{children}</div>
);

function ManageSection() {
  return (
    <>
      <ManageCategories />
      {/* <ManageFoodsButton /> */}
    </>
  );
}

function OfflineContents() {
  const [_, refetch] = useMe();

  useInterval(refetch, 3000);

  return (
    <MainContainer>
      <InstallHint />
      <DarkModeToggle />
      <Button size="small" color="default" onClick={() => refetch()}>
        Retry connection
      </Button>
      <ManageSection />
      <Divider />
      <BugButton />
      <ReloadButton />
    </MainContainer>
  );
}

function AnonymousContents() {
  return (
    <MainContainer>
      <InstallHint />
      <DarkModeToggle />
      <div>
        <div className="flex flex-row items-center gap-2">
          <PromoteSubscriptionButton color="primary">
            Upgrade now
          </PromoteSubscriptionButton>
          <LoginButton color="default" returnTo="/">
            <ArrowRightIcon />
            <span>Sign in</span>
          </LoginButton>
        </div>
        <span className="text-xs">
          Sync devices, collaborate with others, and more
        </span>
      </div>
      <Divider />
      <ManageSection />
      <Divider />
      <BugButton />
      <ReloadButton />
    </MainContainer>
  );
}

function UnsubscribedContents() {
  return (
    <MainContainer>
      <InstallHint />
      <DarkModeToggle />
      <div className="bg-primary-wash color-black p-4 rounded-lg">
        Subscription inactive
      </div>
      <ManagePlanButton />
      <ManageSection />
      <LogoutButton>Sign out</LogoutButton>
      <Divider />
      <BugButton />
      <ReloadButton />
    </MainContainer>
  );
}

function OnlineContents() {
  return (
    <MainContainer>
      <InstallHint />
      <DarkModeToggle />
      <H2>Collaborate</H2>
      <PushSubscriptionToggle vapidKey={VAPID_KEY} />
      <Divider />
      <H2>Manage</H2>
      <ManagePlanButton />
      <ManageSection />
      <Divider />
      <H2>Troubleshoot</H2>
      <BugButton />
      <ReloadButton />
      <ResetToServer clientDescriptor={groceriesDescriptor} />
      <Divider />
      <LogoutButton>Sign out</LogoutButton>
    </MainContainer>
  );
}

function ManageCategories() {
  return (
    <div>
      <ManageCategoriesDialog>
        <Button>Manage categories</Button>
      </ManageCategoriesDialog>
      <span className="text-xs">Add, remove, and rearrange categories</span>
    </div>
  );
}
