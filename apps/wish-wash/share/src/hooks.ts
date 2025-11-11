import { toast, useLocalStorage } from '@a-type/ui';
import { graphql, VariablesOf } from '@biscuits/graphql';
import { useMutation } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import request from 'graphql-request';
import { useEffect, useState } from 'react';
import { useHubContext } from './components/Context.jsx';
import { useLocalPurchase } from './utils/localPurchases.js';
import { proxyAuthMiddleware } from './utils/proxyAuthMiddleware.js';

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

const purchaseItem = createServerFn()
	.inputValidator((input: VariablesOf<typeof purchase>['input']) => input)
	.middleware([proxyAuthMiddleware])
	.handler(async ({ data, context }) => {
		const res = await request(
			`${env.API_ORIGIN}/graphql`,
			purchase,
			{
				input: data,
			},
			context.headers,
		);

		if (!res?.purchasePublicItem) {
			throw notFound();
		}

		return res.purchasePublicItem;
	});

export function usePurchaseItem(id: string) {
	const { wishlistSlug } = useHubContext();
	const doPurchase = useServerFn(purchaseItem);
	const [_, setLocalPurchase] = useLocalPurchase(id);
	const mutation = useMutation({
		mutationFn: (input: VariablesOf<typeof purchase>['input']) =>
			doPurchase({
				data: input,
			}),
		onError: (error: unknown) => {
			console.error(error);
			toast.error(`Hm, something went wrong. Try again?`);
		},
		onSuccess: () => {
			setLocalPurchase(true);
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
