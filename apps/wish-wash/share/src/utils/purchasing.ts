import { graphql, VariablesOf } from '@biscuits/graphql';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import request from 'graphql-request';
import { proxyAuthMiddleware } from './proxyAuthMiddleware.js';

const purchase = graphql(`
	mutation PurchaseItem($input: PurchasePublicItemInput!) {
		purchasePublicItem(input: $input)
	}
`);

export type PurchaseItemInput = VariablesOf<typeof purchase>['input'];

export const purchaseItem = createServerFn()
	.inputValidator((input: PurchaseItemInput) => input)
	.middleware([proxyAuthMiddleware])
	.handler(async ({ data, context }) => {
		try {
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
		} catch (err) {
			console.error(`[Purchase Item Error]`, err);
			throw err;
		}
	});

const unpurchase = graphql(`
	mutation UnpurchaseItem($input: UnpurchasePublicItemInput!) {
		unpurchasePublicItem(input: $input)
	}
`);
export type UnpurchaseItemInput = VariablesOf<typeof unpurchase>['input'];

export const unpurchaseItem = createServerFn()
	.inputValidator((input: UnpurchaseItemInput) => input)
	.middleware([proxyAuthMiddleware])
	.handler(async ({ data, context }) => {
		try {
			const res = await request(
				`${env.API_ORIGIN}/graphql`,
				unpurchase,
				{
					input: data,
				},
				context.headers,
			);

			return res.unpurchasePublicItem;
		} catch (err) {
			console.error(`[Unpurchase Item Error]`, err);
			throw err;
		}
	});
