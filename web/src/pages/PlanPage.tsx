import { graphql } from '@/graphql';
import { Button } from '@a-type/ui/components/button';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { useNavigate } from '@verdant-web/react-router';
import { Suspense, useEffect } from 'react';
import { useMutation, useQuery } from 'urql';

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
  const [result, refetch] = useQuery({ query: PlanPageData });
  const { data } = result;

  const navigate = useNavigate();

  useEffect(() => {
    if (!result.fetching && !result.data?.me) {
      navigate('/join');
    }
  }, [result, navigate]);

  if (!data?.plan) {
    return <NoPlanPage onCreate={refetch} />;
  }

  const plan = data.plan;

  if (!plan.subscriptionStatus || plan.subscriptionStatus === 'canceled') {
    return <NoSubscriptionPage onSubscribed={refetch} />;
  }

  return (
    <PageRoot>
      <PageContent>
        <H1>Your Plan</H1>
        <Suspense>
          <PlanPageMembers />
        </Suspense>
      </PageContent>
    </PageRoot>
  );
}

export default PlanPage;

const PlanPageMembersData = graphql(`
  query PlanPageMembers {
    plan {
      members {
        id
        name
        email
      }
    }
  }
`);

function PlanPageMembers() {
  const [{ data }] = useQuery({ query: PlanPageMembersData });

  return (
    <div className="grid">
      {data?.plan?.members.map((member) => (
        <div key={member.id}>
          <p>{member.name}</p>
          <p>{member.email}</p>
        </div>
      ))}
    </div>
  );
}

const PlanPageCreatePlan = graphql(`
  mutation PlanPageCreatePlan {
    createPlan {
      user {
        id
      }
    }
  }
`);

function NoPlanPage({ onCreate }: { onCreate?: () => void }) {
  const [result, createPlan] = useMutation(PlanPageCreatePlan);

  return (
    <PageRoot>
      <PageContent>
        <H1>You have no plan</H1>
        <div className="flex flex-col items-start gap-4">
          <div>
            This shouldn&apos;t really happen, but just in case I made a button
            that fixes that for you.
          </div>
          <Button
            onClick={async () => {
              await createPlan({});
              onCreate?.();
            }}
          >
            Fix it
          </Button>
        </div>
      </PageContent>
    </PageRoot>
  );
}

function NoSubscriptionPage({ onSubscribed }: { onSubscribed?: () => void }) {
  return (
    <PageRoot>
      <PageContent>
        <H1>Choose your plan</H1>
        <div>TODO: plan options</div>
      </PageContent>
    </PageRoot>
  );
}
