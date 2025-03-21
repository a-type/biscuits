import { Button, P } from '@a-type/ui';
import { apps } from '@biscuits/apps';
import { useHasServerAccess } from '../hooks/graphql.js';
import { useLocalStorage } from '../hooks/useStorage.js';
import { useAppId } from './Context.js';
import { PromoteSubscriptionButton } from './PromoteSubscriptionButton.js';

export function InfrequentSubscriptionHint() {
	const appId = useAppId();
	const appName = apps.find((app) => app.id === appId)?.name ?? 'this app';
	const isSubscribed = useHasServerAccess();

	const [startCountingAt] = useLocalStorage(
		'first-time-seen',
		Date.now(),
		true,
	);

	// if this component mounts and the user has been using the app for more than 30 days, show the hint
	// once. after dismissal, the time to show again is upped to 60 days.
	const [dismissedAt, setDismissedAt] = useLocalStorage(
		'subscription-hint-dismissed-at',
		0,
	);

	const now = Date.now();
	const daysSinceFirstSeen = (now - startCountingAt) / 1000 / 60 / 60 / 24;
	const daysSinceDismissed = (now - dismissedAt) / 1000 / 60 / 60 / 24;

	// strict check important. undefined = not loaded
	if (isSubscribed !== false) {
		return null;
	}

	if (daysSinceDismissed > 60 && daysSinceFirstSeen > 30) {
		return (
			<div className="border-light rounded-md flex flex-col p-4 gap-3 color-gray8">
				<P>Enjoying {appName}? A subscription unlocks device sync and more</P>
				<div className="flex items-center justify-end gap-2">
					<Button color="ghost" onClick={() => setDismissedAt(Date.now())}>
						Dismiss
					</Button>
					<PromoteSubscriptionButton>Learn more</PromoteSubscriptionButton>
				</div>
			</div>
		);
	}

	return null;
}
