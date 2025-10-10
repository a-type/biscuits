import { Box, Chip, H1, Provider as UIProvider } from '@a-type/ui';
import { graphql } from '@biscuits/graphql';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import request from 'graphql-request';
import { useEffect } from 'react';
import { HubContextProvider } from '~/components/Context.js';
import { Items, itemsFragment } from '~/components/Items.js';
import { listIdMiddleware } from '~/utils/listIdMiddleware.js';
import { proxyAuthMiddleware } from '~/utils/proxyAuthMiddleware.js';

export const homeQuery = graphql(
	`
		query Home($listId: ID!) {
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
					purchasedCount
					count
					prioritized
					createdAt
					...Items
				}
			}
		}
	`,
	[itemsFragment],
);

const fetchList = createServerFn()
	.middleware([proxyAuthMiddleware, listIdMiddleware])
	.handler(async ({ context }) => {
		const hidePurchases = false;
		const res = await request(
			`${env.API_ORIGIN}/graphql`,
			homeQuery,
			{
				listId: context.listId,
				hidePurchases,
			},
			context.headers,
		);

		if (!res?.publicWishlist) {
			throw notFound();
		}

		return res.publicWishlist;
	});

export const Route = createFileRoute('/')({
	component: RouteComponent,
	loader: () => fetchList(),
});

function RouteComponent() {
	const data = Route.useLoaderData();

	useEffect(() => {
		// set page title to list title on load
		document.title = data.title;
	}, [data.title]);

	const createdAtDate = new Date(data.createdAt);

	return (
		<HubContextProvider wishlistSlug={data.slug}>
			<UIProvider>
				<Box
					d="col"
					full="width"
					p
					gap="lg"
					items="center"
					className="flex-[1_0_auto]"
				>
					<Box d="col" gap="lg" className="w-full max-w-800px">
						{data.coverImageUrl && (
							<img
								src={data.coverImageUrl}
								className="w-full h-[20vh] object-cover rounded-lg"
								crossOrigin="anonymous"
							/>
						)}
						<H1>{data.title}</H1>
						<Box gap className="text-xs">
							<Chip>{data.items.length} items</Chip>
							<Chip>By {data.author}</Chip>
							<Chip>Created {createdAtDate.toLocaleDateString()}</Chip>
						</Box>
						<Box surface="primary" className="mr-auto" p>
							Click any item to see details and links
						</Box>
					</Box>
					<Items
						items={data.items}
						listAuthor={data.author}
						className="pb-10 w-full max-w-1280px"
					/>
				</Box>
			</UIProvider>
		</HubContextProvider>
	);
}
