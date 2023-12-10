import { Button } from '@a-type/ui/components/button';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { Spinner } from '@a-type/ui/components/spinner';
import { H1 } from '@a-type/ui/components/typography';
import { client } from '@biscuits/client/react';
import { useNavigate } from '@verdant-web/react-router';
import { Suspense, useEffect } from 'react';

export interface PlanPageProps {}

export function PlanPage({}: PlanPageProps) {
  const [session] = client.auth.session.useSuspenseQuery();
  const [status, { refetch }] = client.plan.status.useSuspenseQuery();

  const navigate = useNavigate();

  useEffect(() => {
    if (!session.session) {
      navigate('/join');
    }
  }, [session.session, navigate]);

  if (!session.session) {
    return <Spinner />;
  }

  if (!status) {
    return <NoPlanPage onCreate={refetch} />;
  }

  if (!status.subscriptionStatus || status.subscriptionStatus === 'canceled') {
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

function PlanPageMembers() {
  const [data] = client.plan.members.useSuspenseQuery();

  return (
    <div className="grid">
      {data.map((member) => (
        <div key={member.id}>
          <p>{member.fullName}</p>
          <p>{member.email}</p>
        </div>
      ))}
    </div>
  );
}

function NoPlanPage({ onCreate }: { onCreate?: () => void }) {
  const { mutateAsync: createPlan } = client.plan.create.useMutation({
    onSuccess: onCreate,
  });

  return (
    <PageRoot>
      <PageContent>
        <H1>You have no plan</H1>
        <div className="flex flex-col items-start gap-4">
          <div>
            This shouldn&apos;t really happen, but just in case I made a button
            that fixes that for you.
          </div>
          <Button onClick={() => createPlan()}>Fix it</Button>
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
