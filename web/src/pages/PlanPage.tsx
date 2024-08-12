import { graphql } from '@/graphql.js';
import {
  PageContent,
  PageFixedArea,
  PageRoot,
} from '@a-type/ui/components/layouts';
import { H1, H2, H3 } from '@a-type/ui/components/typography';
import { Link, useNavigate, useSearchParams } from '@verdant-web/react-router';
import { Suspense, useEffect } from 'react';
import { NetworkStatus, useQuery, SubscriptionSetup } from '@biscuits/client';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { MembersAndInvitations } from '@/components/plan/MembersAndInvitations.jsx';
import { VerdantLibraries } from '@/components/storage/VerdantLibraries.jsx';
import { LogoutButton, useLocalStorage } from '@biscuits/client';
import { apps } from '@biscuits/apps';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { Footer } from '@/components/help/Footer.jsx';
import { EmailUpdatesToggle } from '@/components/user/EmailUpdatesToggle.jsx';
import {
  UserInfoEditor,
  userInfoFragment,
} from '@/components/user/UserInfoEditor.jsx';

const PlanPageData = graphql(
  `
    query PlanPageData {
      me {
        id
        plan {
          id
          subscriptionStatus
          isSubscribed
        }
        ...UserInfoEditor_userInfoFragment
      }
    }
  `,
  [userInfoFragment],
);

export interface PlanPageProps {}

export function PlanPage({}: PlanPageProps) {
  const result = useQuery(PlanPageData);
  const { data } = result;
  const [searchParams] = useSearchParams();
  const returnToAppId = searchParams.get('appReferrer');
  const returnToApp = apps.find((app) => app.id === returnToAppId) ?? undefined;
  const returnToAppUrl = import.meta.env.DEV
    ? returnToApp?.devOriginOverride
    : returnToApp?.url;

  const hasAccount = !!result.data?.me;
  const [_, setSeen] = useLocalStorage('seenBefore', false);
  useEffect(() => {
    if (hasAccount) setSeen(true);
  }, [setSeen, hasAccount]);

  const navigate = useNavigate();

  useEffect(() => {
    if (result.networkStatus === NetworkStatus.ready && !hasAccount) {
      const search = window.location.search;
      const path = window.location.pathname;
      const returnTo = encodeURIComponent(path + search);
      navigate(`/login?returnTo=${returnTo}`);
    }
  }, [result, navigate, hasAccount]);

  return (
    <PageRoot>
      <PageContent innerProps={{ className: 'flex flex-col gap-6' }}>
        <PageFixedArea className="mb-10 flex flex-row items-center w-full justify-between">
          <Button asChild color="primary">
            <Link to={returnToAppUrl ?? '/'}>
              <Icon name="arrowLeft" />
              <span>Back to {returnToApp?.name ?? 'apps'}</span>
            </Link>
          </Button>
          <LogoutButton />
        </PageFixedArea>
        <ErrorBoundary>
          <Suspense>
            <H2>Your Account</H2>
            {data?.me && <UserInfoEditor user={data.me} />}
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense>
            <EmailUpdatesToggle isSubscribed={data?.me?.plan?.isSubscribed} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary
          fallback={
            <div>Something went wrong. Couldn&apos;t load this content.</div>
          }
        >
          <Suspense>
            <SubscriptionSetup />
            {!!data?.me?.plan && (
              <>
                <div className="flex flex-col gap-3">
                  <H3>Members</H3>
                  <MembersAndInvitations />
                </div>
                <div className="flex flex-col gap-3">
                  <H3>App data</H3>
                  <VerdantLibraries />
                </div>
              </>
            )}
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </PageContent>
    </PageRoot>
  );
}

export default PlanPage;
