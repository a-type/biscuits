import { Box, Chip, H1, Provider as UIProvider } from '@a-type/ui';
import { ApolloProvider, graphql, graphqlClient } from '@biscuits/graphql';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import request from 'graphql-request';
import { useEffect } from 'react';
import { HubContextProvider } from '~/components/Context.js';
import { Items, itemsFragment } from '~/components/Items.js';
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
	.inputValidator((id: string) => id)
	.middleware([proxyAuthMiddleware])
	.handler(async ({ data, context }) => {
		const hidePurchases = false;
		console.log(context.headers);
		const res = await request(
			`${env.API_ORIGIN}/graphql`,
			homeQuery,
			{
				listId: data,
				hidePurchases,
			},
			context.headers,
		);

		if (!res?.publicWishlist) {
			throw notFound();
		}

		return res.publicWishlist;
	});

export const Route = createFileRoute('/$listId')({
	loader: ({ params: { listId } }) => fetchList({ data: listId }),
	component: Home,
});

function Home() {
	const data = Route.useLoaderData();

	useEffect(() => {
		// set page title to list title on load
		document.title = data.title;
	}, [data.title]);

	const sortedItems = data.items.sort((a, b) => {
		if (a.purchasedCount >= a.count) {
			return 1;
		}
		if (b.purchasedCount >= b.count) {
			return -1;
		}
		if (a.prioritized && !b.prioritized) {
			return -1;
		}
		if (!a.prioritized && b.prioritized) {
			return 1;
		}
		return a.createdAt < b.createdAt ? 1 : -1;
	});

	const createdAtDate = new Date(data.createdAt);

	return (
		<HubContextProvider wishlistSlug={data.slug}>
			<ApolloProvider client={graphqlClient}>
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
							items={sortedItems}
							listAuthor={data.author}
							className="pb-10 w-full max-w-1280px"
						/>
					</Box>
				</UIProvider>
			</ApolloProvider>
		</HubContextProvider>
	);
}
