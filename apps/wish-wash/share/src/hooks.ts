import { toast, useLocalStorage } from '@a-type/ui';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useState } from 'react';
import { useHubContext } from './components/Context.jsx';
import { useLocalPurchase } from './utils/localPurchases.js';
import {
	purchaseItem,
	PurchaseItemInput,
	unpurchaseItem,
	UnpurchaseItemInput,
} from './utils/purchasing.js';

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

export function usePurchaseItem(id: string) {
	const { wishlistSlug } = useHubContext();
	const doPurchase = useServerFn(purchaseItem);
	const [_, setLocalPurchase] = useLocalPurchase(id);
	const mutation = useMutation({
		mutationFn: (input: PurchaseItemInput) =>
			doPurchase({
				data: input,
			}),
		onError: (error: unknown) => {
			console.error(error);
			toast.error(`Hm, something went wrong. Try again?`);
		},
		onSuccess: (purchaseId: string) => {
			setLocalPurchase(purchaseId);
			toast.success(`Thanks for letting us know!`);
		},
	});

	const execute = ({ quantity, name }: { quantity: number; name: string }) => {
		return mutation.mutateAsync({
			wishlistSlug,
			itemId: id,
			quantity,
			name,
		});
	};

	return [execute, mutation] as const;
}

export function useShowPurchased() {
	return useLocalStorage('show-purchased-items', false, false);
}

export function useUnpurchaseItem(itemId: string) {
	const [localPurchaseId, setLocalPurchase] = useLocalPurchase(itemId);
	const mutation = useMutation({
		mutationFn: (input: UnpurchaseItemInput) =>
			unpurchaseItem({
				data: input,
			}),
		onError: (error: unknown) => {
			console.error(error);
			toast.error(`Hm, something went wrong. Try again?`);
		},
		onSuccess: () => {
			setLocalPurchase(null);
			toast.success(`Purchase removed.`);
		},
	});

	const execute = () => {
		if (!localPurchaseId) {
			return Promise.reject(new Error('No local purchase found'));
		}
		return mutation.mutateAsync({
			itemId,
			purchaseId: localPurchaseId,
		});
	};

	return [execute, mutation] as const;
}
