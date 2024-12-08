import { Dialog, P } from '@a-type/ui';
import { LoginButton, useIsLoggedIn } from '@biscuits/client';
import { useSnapshot } from 'valtio';
import { upsellState } from './upsellState.js';

export interface SubscriptionDialogProps {}

export function SubscriptionDialog({}: SubscriptionDialogProps) {
	const { show } = useSnapshot(upsellState);
	const isSignedIn = useIsLoggedIn();

	return (
		<Dialog open={show} onOpenChange={(o) => (upsellState.show = o)}>
			<Dialog.Content>
				<Dialog.Title>Share your list for a year</Dialog.Title>
				<P className="gutter-bottom">
					Sign up for free to share your list with friends and family!
				</P>
				<P>
					Free users get one published wishlist on the house to share with
					others. Recipients can browse your list and mark items as purchased.
				</P>
				<Dialog.Actions>
					<Dialog.Close>Nevermind</Dialog.Close>
					<LoginButton
						tab="signup"
						color="primary"
						onClick={() => (upsellState.show = false)}
					>
						Get started
					</LoginButton>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
