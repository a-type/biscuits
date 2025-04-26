import {
	Box,
	H1,
	P,
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
						<Box d="col" gap className="w-full max-w-800px">
							{data.coverImageUrl && (
								<img
									src={data.coverImageUrl}
									className="w-full h-[20vh] object-cover rounded-lg"
								/>
							)}
							<H1>{data.title}</H1>
							<P>{data.items.length} items</P>
						</Box>
						<Items
							items={sortedItems}
							listAuthor={data.author}
							className="pb-10 w-full max-w-1690px"
						/>
					</Box>
				</UIProvider>
			</ApolloProvider>
		</HubContextProvider>
	);
};
