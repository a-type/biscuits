import { Dialog, DialogContent, H2 } from '@a-type/ui';
import { useMe } from '../hooks/graphql.js';
import { LogoutButton } from './LogoutButton.js';
import { ManagePlanButton } from './ManagePlanButton.js';

export interface SubscriptionExpiredDialogProps {}

export function SubscriptionExpiredDialog({}: SubscriptionExpiredDialogProps) {
	const { data } = useMe();
	const isLoggedIn = !!data?.me;
	const subscriptionStatus = data?.me?.plan?.subscriptionStatus;

	const open = isLoggedIn && subscriptionStatus === 'expired';

	return (
		<Dialog open={open}>
			<DialogContent>
				<H2>Subscription expired</H2>
				<p>
					Looks like you either cancelled your subscription, or your payment
					didn&apos;t go through. To keep using sync, please check your card
					details.
				</p>
				<ManagePlanButton />
				<p>
					If you intended to cancel your subscription, log out to dismiss this
					message.
				</p>
				<LogoutButton>Log out</LogoutButton>
			</DialogContent>
		</Dialog>
	);
}
