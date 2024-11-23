import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { H1, P } from '@a-type/ui/components/typography';
import { useEffect } from 'react';
import { HubWishlistData } from './types.js';
import { ApolloProvider, graphqlClient } from '@biscuits/graphql';
import { Items } from './components/Items.jsx';
import { HubContextProvider } from './components/Context.jsx';
import { Provider as UIProvider } from '@a-type/ui/components/provider';

const innerProps = {
	className: 'max-w-600px',
};

export function App({ list: data }: { list: HubWishlistData }) {
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
}
