import { graphql } from '@biscuits/graphql/server';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import request from 'graphql-request';

export type PostType = {
	id: number;
	title: string;
	body: string;
};

export const fetchList = createServerFn()
	.inputValidator((id: string) => id)
	.handler(async ({ data }) => {
		const hidePurchases = false;
		const res = await request(
			`${env.API_ORIGIN}/graphql`,
			graphql(`
				query GetPublicList($listId: ID!) {
					publicWishlist(id: $listId) {
						id
						slug
						title
						author
						coverImageUrl
						createdAt
						description
						items {
							id
							description
							count
							purchasedCount
							links
							prioritized
							imageUrls
							createdAt
							note
							priceMin
							priceMax
							type
							prompt
							remoteImageUrl
						}
					}
				}
			`),
			{
				listId: data,
				hidePurchases,
			},
		);

		if (!res?.publicWishlist) {
			throw notFound();
		}

		return res.publicWishlist;
	});
