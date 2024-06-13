import {
  useIsSubscribedToPush,
  useSubscribeToPush,
  useUnsubscribeFromPush,
} from '../push.js';
import { Switch } from '@a-type/ui/components/switch';
import { useState } from 'react';
import { useCanSync } from '../graphql.js';
import { useIsServiceWorkerRegistered } from '../hooks/useIsServiceWorkerRegistered.js';

export interface PushSubscriptionToggleProps {
  vapidKey: string;
}

export function PushSubscriptionToggle({
  vapidKey,
}: PushSubscriptionToggleProps) {
  const subscribed = useIsSubscribedToPush();
  const loadingSubscription = subscribed === undefined;
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
  const canSync = useCanSync();
  const canSubscribe = useIsServiceWorkerRegistered();
  if (!canSubscribe || !canSync) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <Switch
        checked={subscribed}
        onCheckedChange={toggle}
        disabled={loading}
      />
      <span>Notify me when someone adds or removes from the list</span>
    </div>
  );
}
