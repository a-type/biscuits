import { SubscriptionSetup } from '@/components/subscription/SubscriptionSetup';
import { graphql } from '@/graphql';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { Avatar } from '@a-type/ui/components/avatar';
import { H1, H2 } from '@a-type/ui/components/typography';
import { useNavigate } from '@verdant-web/react-router';
import { Suspense, useEffect } from 'react';
import { useQuery } from 'urql';

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
      <PageContent>
        <H1>Your Plan</H1>
        <Suspense>
          <SubscriptionSetup />
          {!!data?.plan && <PlanPageMembers />}
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
        imageUrl
      }
    }
  }
`);

function PlanPageMembers() {
  const [{ data }] = useQuery({ query: PlanPageMembersData });

  return (
    <div className="flex flex-col gap-3">
      <H2>Members</H2>
      <div className="grid">
        {data?.plan?.members.map((member) => (
          <div
            key={member.id}
            className="rounded-md border border-solid border-gray-5 p-4"
          >
            <div className="flex flex-row gap-3">
              <Avatar imageSrc={member.imageUrl ?? undefined} />
              <div className="flex flex-col gap-2 items-start justify-start">
                <span>{member.name}</span>
                <span>{member.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
