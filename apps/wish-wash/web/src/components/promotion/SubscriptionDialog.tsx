import { Button, Dialog, P } from '@a-type/ui';
import { CONFIG, useIsLoggedIn } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';
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
					For $10, share your list with friends and family all year. (That's
					your next birthday <i>and</i> yearly holidays sorted!)
				</P>
				<P>
					You'll get a link for your list you can share with people. They can
					browse and mark items as bought.
				</P>
				<Dialog.Actions>
					<Dialog.Close>Nevermind</Dialog.Close>
					<Button asChild color="primary">
						<Link
							onClick={() => (upsellState.show = false)}
							to={
								isSignedIn ? '/buy-yearly' : (
									`${CONFIG.HOME_ORIGIN}/login?tab=signup&appReferrer=wish-wash&appReturnTo=${encodeURIComponent('/buy-yearly')}`
								)
							}
						>
							Subscribe
						</Link>
					</Button>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
