import { Avatar } from '@a-type/ui/components/avatar';
import {
	CardActions,
	CardContent,
	CardFooter,
	CardGrid,
	CardMain,
	CardRoot,
	CardTitle,
} from '@a-type/ui/components/card';
import { useMutation, useSuspenseQuery, graphql } from '@biscuits/graphql';
import { InviteMember } from './InviteMember.js';
import { H2, H3 } from '@a-type/ui/components/typography';
import { ConfirmedButton } from '@a-type/ui/components/button';

const membersQuery = graphql(`
	query PlanMembers {
		me {
			id
			role
			plan {
				id
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
	}
`);

export function MembersAndInvitations() {
	const { data } = useSuspenseQuery(membersQuery);
	const plan = data?.me?.plan;
	const isAdmin = data?.me?.role === 'admin';

	return (
		<div>
			<CardGrid>
				{plan?.members.map((member) => {
					const isMe = member.id === data?.me?.id;
					return (
						<CardRoot key={member.id}>
							<CardMain className="justify-start">
								<CardTitle className="flex-row mt-0">
									<Avatar imageSrc={member.imageUrl ?? undefined} />
									{member.name}
									{isMe && <span className="font-bold"> (you)</span>}
								</CardTitle>
								<CardContent>{member.email}</CardContent>
							</CardMain>
							{isAdmin && !isMe && (
								<CardFooter>
									<CardActions>
										<KickMemberButton
											memberId={member.id as string}
											name={member.name}
										/>
									</CardActions>
								</CardFooter>
							)}
						</CardRoot>
					);
				})}
				{plan?.pendingInvitations.map((invite) => (
					<CardRoot key={invite.id}>
						<CardMain>
							<Avatar />
							<div className="flex flex-col gap-2 items-start justify-start">
								<span>Invited: {invite.email}</span>
							</div>
						</CardMain>
						<CardFooter>
							<CardActions>
								{isAdmin && <CancelInvitationButton id={invite.id as string} />}
							</CardActions>
						</CardFooter>
					</CardRoot>
				))}
			</CardGrid>
			{plan?.canInviteMore ?
				<div className="py-4">
					<H3>Invite someone</H3>
					<InviteMember />
				</div>
			:	<div className="py-4 color-gray-9">
					You&apos;ve reached your membership limit. Upgrade to add more people.
				</div>
			}
		</div>
	);
}

const kickMember = graphql(`
	mutation KickMember($memberId: ID!) {
		kickMember(userId: $memberId) {
			plan {
				id
				members {
					id
					name
					email
					imageUrl
				}
			}
		}
	}
`);

function KickMemberButton({
	memberId,
	name,
}: {
	memberId: string;
	name: string;
}) {
	const [kick, { loading }] = useMutation(kickMember);

	return (
		<ConfirmedButton
			confirmText={`Are you sure you want to remove ${name}?`}
			disabled={loading}
			onConfirm={() => kick({ variables: { memberId } })}
			size="small"
			color="destructive"
		>
			Remove member
		</ConfirmedButton>
	);
}

const cancelInvitation = graphql(`
	mutation CancelInvitation($id: ID!) {
		cancelPlanInvitation(id: $id) {
			plan {
				id
				pendingInvitations {
					id
					email
				}
			}
		}
	}
`);

function CancelInvitationButton({ id }: { id: string }) {
	const [cancel, { loading }] = useMutation(cancelInvitation);

	return (
		<ConfirmedButton
			confirmText="Are you sure you want to cancel this invitation?"
			disabled={loading}
			onConfirm={() => cancel({ variables: { id } })}
			size="small"
			color="destructive"
		>
			Cancel invitation
		</ConfirmedButton>
	);
}
