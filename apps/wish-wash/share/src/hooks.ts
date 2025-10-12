import { graphql, VariablesOf } from '@biscuits/graphql';
import { useMutation } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import request from 'graphql-request';
import { useEffect, useState } from 'react';
import { useHubContext } from './components/Context.jsx';
import { listIdMiddleware } from './utils/listIdMiddleware.js';
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
	.middleware([proxyAuthMiddleware, listIdMiddleware])
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
	const mutation = useMutation({
		mutationFn: (input: VariablesOf<typeof purchase>['input']) =>
			doPurchase({
				data: input,
			}),
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
