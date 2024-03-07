import { Client, useClient } from 'urql';
import { graphql } from './graphql.js';
import { useAppId } from './react.js';
import { useCallback, useState, useEffect } from 'react';

const subscribeToPushMutation = graphql(`
  mutation SubscribeToPush($subscription: CreatePushSubscriptionInput!) {
    createPushSubscription(input: $subscription)
  }
`);

const unsubscribeFromPushMutation = graphql(`
  mutation UnsubscribeFromPush($endpoint: String!) {
    deletePushSubscription(endpoint: $endpoint)
  }
`);

export async function subscribeToPush(
  appId: string,
  vapidKey: string,
  graphqlClient: Client,
) {
  if (!('serviceWorker' in navigator)) {
    // Service Worker isn't supported on this browser, disable or hide UI.
    return;
  }

  if (!('PushManager' in window)) {
    // Push isn't supported on this browser, disable or hide UI.
    return;
  }

  const sw = await navigator.serviceWorker.getRegistration();

  if (!sw) {
    console.warn(
      'Service worker registration not found; cannot register push notifications',
    );
    return;
  }

  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey),
  });

  const parsedSubscription = JSON.parse(JSON.stringify(subscription)) as {
    endpoint: string;
    expirationTime: number | null;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  await graphqlClient.mutation(subscribeToPushMutation, {
    subscription: {
      appId,
      endpoint: parsedSubscription.endpoint,
      auth: parsedSubscription.keys.auth,
      p256dh: parsedSubscription.keys.p256dh,
    },
  });
}

export function useSubscribeToPush(vapidKey: string) {
  const appId = useAppId();
  const graphqlClient = useClient();
  return useCallback(
    () => subscribeToPush(appId, vapidKey, graphqlClient),
    [appId, graphqlClient, vapidKey],
  );
}

export async function unsubscribeFromPush(graphqlClient: Client) {
  const sw = await navigator.serviceWorker.getRegistration();

  if (!sw) {
    console.warn(
      'Service worker registration not found; cannot register push notifications',
    );
    return;
  }

  const subscription = await sw.pushManager.getSubscription();

  if (!subscription) {
    console.warn('No push subscription found');
    return;
  }

  await subscription.unsubscribe();
  await graphqlClient.mutation(unsubscribeFromPushMutation, {
    endpoint: subscription.endpoint,
  });
}

export function useUnsubscribeFromPush() {
  const graphqlClient = useClient();
  return useCallback(() => unsubscribeFromPush(graphqlClient), [graphqlClient]);
}

export async function getIsSubscribedToPush() {
  const sw = await navigator.serviceWorker.getRegistration();

  if (!sw) {
    console.warn(
      'Service worker registration not found; cannot register push notifications',
    );
    return false;
  }

  const subscription = await sw.pushManager.getSubscription();

  if (!subscription) {
    return false;
  }

  return true;
}

export function useIsSubscribedToPush() {
  const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(
    undefined,
  );
  useEffect(() => {
    getIsSubscribedToPush().then(setIsSubscribed);
  }, []);
  return isSubscribed;
}

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
