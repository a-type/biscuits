import {
	Avatar,
	Box,
	CardActions,
	CardContent,
	CardFooter,
	CardGrid,
	CardMain,
	CardRoot,
	CardTitle,
	ConfirmedButton,
	H3,
} from '@a-type/ui';
import { graphql, useMutation, useSuspenseQuery } from '@biscuits/graphql';
import { Link } from '@verdant-web/react-router';
import { InviteMember } from './InviteMember.js';
import classes from './MembersAndInvitations.module.css';

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

	if (!plan) {
		return (
			<p>
				<Link to="?tab=subscription">Subscribe to a plan</Link> to manage
				members.
			</p>
		);
	}

	return (
		<div>
			<CardGrid>
				{plan?.members.map((member) => {
					const isMe = member.id === data?.me?.id;
					return (
						<CardRoot key={member.id}>
							<CardMain className={classes.cardMainJustifyStart}>
								<CardTitle className={classes.cardTitleRow}>
									<Avatar imageSrc={member.imageUrl ?? undefined} />
									{member.name}
									{isMe && <span className={classes.you}> (you)</span>}
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
							<CardTitle className={classes.cardTitleRowMuted}>
								<Avatar />
								<span>Invited: {invite.email}</span>
							</CardTitle>
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
				<Box className="@mode-leek" col gap p surface border>
					<H3>Invite someone</H3>
					<InviteMember />
				</Box>
			:	<div className={classes.membershipLimit}>
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
			emphasis="primary"
			className="@mode-attention"
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
			emphasis="primary"
			className="@mode-attention"
		>
			Cancel invitation
		</ConfirmedButton>
	);
}
