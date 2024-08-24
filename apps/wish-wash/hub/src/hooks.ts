import { useEffect, useState } from 'react';
import { graphql, useMutation } from '@biscuits/client/graphql';
import { useHubContext } from './components/Context.jsx';

export function useTimer(timeout: number) {
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTriggered(true);
    }, timeout);
    return () => clearTimeout(timer);
  }, [timeout]);
  return triggered;
}

export function useTimers(times: number[]) {
  const [timerIndex, setTimerIndex] = useState(0);
  useEffect(() => {
    if (timerIndex === times.length) {
      return;
    }

    const currentTimer = times[timerIndex];
    const timer = setTimeout(() => {
      setTimerIndex(timerIndex + 1);
    }, currentTimer);
    return () => clearTimeout(timer);
  }, [times, timerIndex]);

  return new Array(times.length).fill(false).map((_, i) => i >= timerIndex);
}

const purchase = graphql(`
  mutation PurchaseItem($input: PurchasePublicItemInput!) {
    purchasePublicItem(input: $input)
  }
`);

export function usePurchaseItem(id: string) {
  const { wishlistSlug } = useHubContext();
  const [purchaseItem, state] = useMutation(purchase);

  const doPurchase = ({
    quantity,
    name,
  }: {
    quantity: number;
    name: string;
  }) => {
    return purchaseItem({
      variables: {
        input: {
          wishlistSlug,
          id,
          quantity,
          name,
        },
      },
    });
  };

  return [doPurchase, state] as const;
}
