import { SubscriptionSetup } from '@/components/subscription/SubscriptionSetup';
import { graphql } from '@/graphql';
import {
  PageContent,
  PageFixedArea,
  PageRoot,
} from '@a-type/ui/components/layouts';
import { Avatar } from '@a-type/ui/components/avatar';
import { H1, H2 } from '@a-type/ui/components/typography';
import { Link, useNavigate } from '@verdant-web/react-router';
import { Suspense, useEffect } from 'react';
import { useQuery } from 'urql';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { API_HOST_HTTP } from '@/config';
import { MembersAndInvitations } from '@/components/plan/MembersAndInvitations';
import { VerdantLibraries } from '@/components/storage/VerdantLibraries';

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

  const navigate = useNavigate();

  useEffect(() => {
    if (!result.fetching && !result.data?.me) {
      navigate('/join');
    }
  }, [result, navigate]);

  return (
    <PageRoot>
      <PageContent innerProps={{ className: 'flex flex-col gap-6' }}>
        <PageFixedArea className="mb-10 flex flex-row items-center w-full">
          <Button asChild>
            <Link to="/">
              <Icon name="arrowLeft" /> Back to apps
            </Link>
          </Button>
          <form
            className="ml-auto"
            action={`${API_HOST_HTTP}/auth/logout`}
            method="post"
          >
            <Button type="submit" color="destructive">
              Log Out
            </Button>
          </form>
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
