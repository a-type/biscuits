import {
	H1,
	P,
	PageContent,
	PageRoot,
	Provider as UIProvider,
} from '@a-type/ui';
import { ApolloProvider, graphqlClient } from '@biscuits/graphql';
import { FC, useEffect } from 'react';
import { HubContextProvider } from './components/Context.jsx';
import { Items } from './components/Items.jsx';
import { HubWishlistData } from './types.js';

const innerProps = {
	className: 'max-w-600px',
};

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
			<PageRoot className="theme-leek">
				<PageContent>
					<H1>Wish list not found</H1>
				</PageContent>
			</PageRoot>
		);
	}

	return (
		<HubContextProvider wishlistSlug={data.slug}>
			<ApolloProvider client={graphqlClient}>
				<UIProvider>
					<PageRoot className="theme-leek">
						<PageContent innerProps={innerProps}>
							<H1>{data.title}</H1>
							<P>{data.items.length} items</P>
							<Items items={data.items} listAuthor={data.author} />
						</PageContent>
					</PageRoot>
				</UIProvider>
			</ApolloProvider>
		</HubContextProvider>
	);
};
