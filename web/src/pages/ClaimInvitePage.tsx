import { Footer } from '@/components/help/Footer.jsx';
import {
	Button,
	H1,
	P,
	PageContent,
	PageRoot,
	toast,
	withClassName,
} from '@a-type/ui';
import { BiscuitsError } from '@biscuits/error';
import { graphql, useMutation, useSuspenseQuery } from '@biscuits/graphql';
import { useNavigate, useParams } from '@verdant-web/react-router';
import { useEffect } from 'react';

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

	const infoResult = useSuspenseQuery(claimInviteInfo, {
		variables: { code },
		// avoid error boundary when user is not logged in.
		errorPolicy: 'ignore',
	});

	// redirect non-auth users to join
	const isNotAuthenticated = !infoResult.data?.me;
	useEffect(() => {
		if (isNotAuthenticated) {
			navigate(
				`/login?tab=signup&returnTo=${encodeURIComponent(`/invite/${code}`)}&message=${encodeURIComponent('Sign up or log in to claim your invite.')}`,
			);
		}
	}, [navigate, isNotAuthenticated, code]);

	const [mutateClaim] = useMutation(claimInviteAction);
	const claim = async () => {
		const result = await mutateClaim({ variables: { code } });
		if (!result.errors) {
			toast.success('Welcome to your new membership!', {
				duration: 15000,
			});
			navigate('/settings');
		} else {
			const biscuitsError = BiscuitsError.readFirstGraphQLError(result.errors);
			if (biscuitsError?.code === BiscuitsError.Code.NotFound) {
				toast.error(
					'This invitation code is invalid or has already been used. Ask them to send another one!',
				);
			}
		}
	};

	if (isNotAuthenticated) {
		return null;
	}

	return (
		<PageRoot className="flex-1">
			<PageContent className="h-full flex flex-col justify-between gap-lg">
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
				<Footer />
			</PageContent>
		</PageRoot>
	);
}

export default ClaimInvitePage;

const Warning = withClassName(
	'p',
	'text-destructive-dark bg-destructive-wash block p-4 rounded-md mb-4',
);
