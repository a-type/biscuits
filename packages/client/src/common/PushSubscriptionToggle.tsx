import { Switch } from '@a-type/ui';
import { useState } from 'react';
import { useHasServerAccess } from '../hooks/graphql.js';
import { useIsServiceWorkerRegistered } from '../hooks/useIsServiceWorkerRegistered.js';
import {
	useIsSubscribedToPush,
	useSubscribeToPush,
	useUnsubscribeFromPush,
} from '../push.js';

export interface PushSubscriptionToggleProps {
	vapidKey: string;
}

export function PushSubscriptionToggle({
	vapidKey,
}: PushSubscriptionToggleProps) {
	const subscribed = useIsSubscribedToPush();
	const [loading, setLoading] = useState(false);

	const subscribeToPush = useSubscribeToPush(vapidKey);
	const subscribe = async () => {
		try {
			setLoading(true);
			await subscribeToPush();
		} finally {
			setLoading(false);
		}
	};
	const unsubscribeFromPush = useUnsubscribeFromPush();
	const unsubscribe = async () => {
		try {
			setLoading(true);
			await unsubscribeFromPush();
		} finally {
			setLoading(false);
		}
	};
	const toggle = subscribed ? unsubscribe : subscribe;
	const canSync = useHasServerAccess();
	const canSubscribe = useIsServiceWorkerRegistered();
	if (!canSubscribe || !canSync) {
		return null;
	}

	return (
		<div className="flex flex-row items-center gap-2">
			<Switch
				checked={subscribed}
				onCheckedChange={toggle}
				disabled={loading}
			/>
			<span>Notify me when someone adds or removes from the list</span>
		</div>
	);
}
