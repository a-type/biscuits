import { SubscriptionSetup } from '@/components/subscription/SubscriptionSetup.jsx';
import { graphql } from '@/graphql.js';
import {
  PageContent,
  PageFixedArea,
  PageRoot,
} from '@a-type/ui/components/layouts';
import { H1, H2 } from '@a-type/ui/components/typography';
import { Link, useNavigate, useSearchParams } from '@verdant-web/react-router';
import { Suspense, useEffect } from 'react';
import { useQuery } from 'urql';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { MembersAndInvitations } from '@/components/plan/MembersAndInvitations.jsx';
import { VerdantLibraries } from '@/components/storage/VerdantLibraries.jsx';
import { LogoutButton, useLocalStorage } from '@biscuits/client';
import { apps } from '@biscuits/apps';

const PlanPageData = graphql(`
  query PlanPageData {
    me {
      id
    }
    plan {
      id
      subscriptionStatus
    }
  }
`);

export interface PlanPageProps {}

export function PlanPage({}: PlanPageProps) {
  const [result] = useQuery({ query: PlanPageData });
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
    if (!result.fetching && !hasAccount) {
      const search = window.location.search;
      const path = window.location.pathname;
      const returnTo = encodeURIComponent(path + search);
      navigate(`/login?returnTo=${returnTo}`);
    }
  }, [result, navigate, hasAccount]);

  return (
    <PageRoot>
      <PageContent innerProps={{ className: 'flex flex-col gap-6' }}>
        <PageFixedArea className="mb-10 flex flex-row items-center w-full">
          <Button asChild color="primary">
            <Link to={returnToAppUrl ?? '/'}>
              <Icon name="arrowLeft" />
              <span>Back to {returnToApp?.name ?? 'apps'}</span>
            </Link>
          </Button>
          <LogoutButton />
        </PageFixedArea>
        <H1>Your Plan</H1>
        <Suspense>
          <SubscriptionSetup />
          {!!data?.plan && (
            <div className="flex flex-col gap-3">
              <H2>Members</H2>
              <MembersAndInvitations />
            </div>
          )}
          {!!data?.plan && (
            <div className="flex flex-col gap-3">
              <H2>App data</H2>
              <VerdantLibraries />
            </div>
          )}
        </Suspense>
      </PageContent>
    </PageRoot>
  );
}

export default PlanPage;
