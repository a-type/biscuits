import {
	Box,
	Chip,
	H1,
	PageContent,
	PageRoot,
	Provider as UIProvider,
} from '@a-type/ui';
import { ApolloProvider, graphqlClient } from '@biscuits/graphql';
import { FC, useEffect } from 'react';
import { HubContextProvider } from './components/Context.js';
import { Items } from './components/Items.js';
import { HubWishlistData } from './types.js';

export const App: FC<{ list: HubWishlistData }> = function App({
	list: data,
}: {
	list: HubWishlistData;
}) {
	useEffect(() => {
		// set page title to list title on load
		document.title = data.title;
	}, [data.title]);

	if (!data) {
		return (
			<PageRoot>
				<PageContent>
					<H1>Wish list not found</H1>
				</PageContent>
			</PageRoot>
		);
	}

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
};
