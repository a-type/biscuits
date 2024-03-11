import { graphql } from '@/graphql.js';
import { useNavigate, useParams } from '@verdant-web/react-router';
import { useEffect } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  PageRoot,
  PageContent,
  PageFixedArea,
} from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import { withClassName } from '@a-type/ui/hooks';
import { Button } from '@a-type/ui/components/button';
import { toast } from 'react-hot-toast';

const claimInviteInfo = graphql(`
  query ClaimInviteInfo($code: String!) {
    me {
      id
      plan {
        id
      }
    }
    planInvitation(code: $code) {
      id
      inviterName
    }
  }
`);

const claimInviteAction = graphql(`
  mutation ClaimInvite($code: String!) {
    claimPlanInvitation(code: $code) {
      user {
        id
        plan {
          id
        }
      }
    }
  }
`);

function ClaimInvitePage() {
  const params = useParams<{ code: string }>();
  const navigate = useNavigate();
  const code = params.code;

  const [infoResult] = useQuery({
    query: claimInviteInfo,
    variables: { code },
  });

  // redirect non-auth users to join
  const isNotAuthenticated = infoResult.data && !infoResult.data.me;
  useEffect(() => {
    if (isNotAuthenticated) {
      navigate(`/join?returnTo=${encodeURIComponent(`/claim/${code}`)}`);
    }
  }, [navigate, isNotAuthenticated, code]);

  const [claimResult, mutateClaim] = useMutation(claimInviteAction);
  const claim = async () => {
    const result = await mutateClaim({ code });
    if (!result.error) {
      toast.success('Welcome to your new membership!');
      navigate('/plan');
    }
  };

  if (isNotAuthenticated) {
    return null;
  }

  return (
    <PageRoot>
      <PageContent>
        <div className="flex flex-col items-start gap-6">
          <H1>
            Join {infoResult.data?.planInvitation?.inviterName ?? 'someone'}’s
            plan
          </H1>
          <P>
            You&apos;re about to join someone else&apos;s plan on Biscuits. That
            means you&apos;ll share data with them in all the apps and be able
            to collaborate in real-time. Your plan membership also gives you
            access to all member-only features.
          </P>
          {!!infoResult.data?.me?.plan && (
            <Warning>
              You&apos;re already a member of a plan. If you join this plan,
              you&apos;ll be removed from your current plan.
            </Warning>
          )}
          <Button onClick={claim}>Claim Invite</Button>
        </div>
      </PageContent>
    </PageRoot>
  );
}

export default ClaimInvitePage;

const Warning = withClassName(
  'p',
  'text-destructive-dark bg-destructive-wash block p-4 rounded-md mb-4',
);
