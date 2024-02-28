import { graphql } from '@/graphql';
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
    }
  }
`);

export function MembersAndInvitations() {
  const [{ data }, refetch] = useQuery({ query: membersQuery });

  return (
    <div>
      <CardGrid>
        {data?.plan?.members.map((member) => (
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
        {data?.plan?.pendingInvitations.map((invite) => (
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
      <InviteMember />
    </div>
  );
}
