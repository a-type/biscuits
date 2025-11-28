import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import request from 'graphql-request';
import { listPageQuery } from '~/components/ListPage.js';
import { listIdMiddleware } from './listIdMiddleware.js';
import { proxyAuthMiddleware } from './proxyAuthMiddleware.js';

export const fetchList = createServerFn()
	.inputValidator((listId?: string) => listId)
	.middleware([proxyAuthMiddleware, listIdMiddleware])
	.handler(async ({ context, data }) => {
		try {
			const hidePurchases = false;
			const res = await request(
				`${env.API_ORIGIN}/graphql`,
				listPageQuery,
				{
					listId: data || context.listId,
					hidePurchases,
				},
				context.headers,
			);

			if (!res?.publicWishlist) {
				throw notFound();
			}

			return res.publicWishlist;
		} catch (err) {
			console.error('Error fetching list:', err);
			throw err;
		}
	});
