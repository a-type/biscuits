import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@a-type/ui';
import { graphql, useMutation } from '@biscuits/graphql';
import * as CONFIG from '../config.js';
import { useMe } from '../hooks/graphql.js';
import { TOS_UPDATED_AT } from '../tos.js';

const acceptTosMutation = graphql(`
	mutation AcceptTos {
		acceptTermsOfService {
			id
			acceptedTermsOfServiceAt
		}
	}
`);

export function TosPrompt() {
	const { data } = useMe();
	const [acceptTos] = useMutation(acceptTosMutation);

	if (!data?.me) {
		return null;
	}

	const needsToUpdateTos =
		!data.me.acceptedTermsOfServiceAt ||
		new Date(data.me.acceptedTermsOfServiceAt) < TOS_UPDATED_AT;

	return (
		<Dialog open={needsToUpdateTos}>
			<DialogContent>
				<DialogTitle>Terms of Service Update</DialogTitle>
				<p>
					We&apos;ve updated our terms of service. Please review and accept to
					continue using Biscuits apps.
				</p>
				<div className="flex flex-col items-start gap-2">
					<Button asChild color="ghost">
						<a href={`${CONFIG.HOME_ORIGIN}/tos`} target="_blank">
							Terms of Service
						</a>
					</Button>
					<Button asChild color="ghost">
						<a href={`${CONFIG.HOME_ORIGIN}/privacy`} target="_blank">
							Privacy Policy
						</a>
					</Button>
				</div>
				<DialogActions>
					<Button asChild>
						<a href={`${CONFIG.HOME_ORIGIN}/settings`} target="_blank">
							Manage Plan or Log Out
						</a>
					</Button>
					<Button color="primary" onClick={() => acceptTos()}>
						Accept
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
