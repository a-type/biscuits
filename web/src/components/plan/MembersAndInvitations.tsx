import { Avatar } from '@a-type/ui/components/avatar';
import {
  CardActions,
  CardFooter,
  CardGrid,
  CardMain,
  CardRoot,
} from '@a-type/ui/components/card';
import { useQuery } from 'urql';
import { InviteMember } from './InviteMember';
import { graphql } from '@/graphql';
import { H2 } from '@a-type/ui/components/typography';

const membersQuery = graphql(`
  query PlanMembers {
    me {
      id
    }
    plan {
      members {
        id
        name
        email
        imageUrl
      }
      pendingInvitations {
        id
        email
      }
      canInviteMore
    }
  }
`);

export function MembersAndInvitations() {
  const [{ data }, refetch] = useQuery({ query: membersQuery });
  const plan = data?.plan;

  return (
    <div>
      <CardGrid>
        {plan?.members.map((member) => (
          <CardRoot key={member.id}>
            <CardMain>
              <Avatar imageSrc={member.imageUrl ?? undefined} />
              <div className="flex flex-col gap-2 items-start justify-start">
                <span>
                  {member.name}
                  {member.id === data?.me?.id && (
                    <span className="font-bold"> (you)</span>
                  )}
                </span>
                <span>{member.email}</span>
              </div>
            </CardMain>
          </CardRoot>
        ))}
        {plan?.pendingInvitations.map((invite) => (
          <CardRoot key={invite.id}>
            <CardMain>
              <Avatar />
              <div className="flex flex-col gap-2 items-start justify-start">
                <span>Invited: {invite.email}</span>
              </div>
            </CardMain>
            <CardFooter>
              <CardActions></CardActions>
            </CardFooter>
          </CardRoot>
        ))}
      </CardGrid>
      {plan?.canInviteMore ? (
        <div className="py-4">
          <H2>Invite someone</H2>
          <InviteMember />
        </div>
      ) : (
        <div className="py-4 color-gray-9">
          You&apos;ve reached your membership limit. Upgrade to add more people.
        </div>
      )}
    </div>
  );
}
