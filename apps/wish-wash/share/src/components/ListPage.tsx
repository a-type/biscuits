import { Box, Chip, H1, Img, Switch, Provider as UIProvider } from '@a-type/ui';
import { graphql, ResultOf } from '@biscuits/graphql';
import { useEffect } from 'react';
import { HubContextProvider } from '~/components/Context.js';
import { Items, itemsFragment } from '~/components/Items.js';
import { useShowPurchased } from '~/hooks.js';

export const listPageQuery = graphql(
	`
		query ListPage($listId: ID!) {
			publicWishlist(id: $listId) {
				id
				slug
				author {
					name
					profileImageUrl
				}
				publishedAt
				data {
					title
					coverImageUrl
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
		}
	`,
	[itemsFragment],
);

export interface ListPageProps {
	data: Exclude<
		ResultOf<typeof listPageQuery>['publicWishlist'],
		null | undefined
	>;
}

export function ListPage({ data }: ListPageProps) {
	useEffect(() => {
		if (!data?.data.title) return;
		// set page title to list title on load
		document.title = data.data.title;
	}, [data?.data.title]);

	const createdAtDate = new Date(data.publishedAt);

	const [showPurchased, setShowPurchased] = useShowPurchased();

	const snapshot = data.data;

	return (
		<HubContextProvider wishlistSlug={data.slug}>
			<UIProvider disableParticles manifestPath="/manifest.webmanifest">
				<Box
					col
					full="width"
					p
					gap="lg"
					items="center"
					grow
					data-testid="list-page"
				>
					<Box col gap="lg" full="width" style={{ maxWidth: 800 }}>
						{snapshot.coverImageUrl && (
							<Img
								fit="cover"
								full="width"
								style={{ height: '20dvh', borderRadius: 'var(--m-rd-lg)' }}
								src={snapshot.coverImageUrl}
								crossOrigin="anonymous"
							/>
						)}
						<H1>{snapshot.title}</H1>
						<Box gap className="text-xs">
							<Chip>{snapshot.items.length} items</Chip>
							<Chip>By {data.author.name}</Chip>
							<Chip>Created {createdAtDate.toLocaleDateString()}</Chip>
						</Box>
						<Box
							surface="secondary"
							wrap
							justify="between"
							items="center"
							full="width"
							gap
						>
							<Box p>Click any item to see details and links</Box>
							<Box p items="center" render={<label />} gap>
								Show purchased items
								<Switch
									checked={showPurchased}
									onCheckedChange={setShowPurchased}
								/>
							</Box>
						</Box>
					</Box>
					<Items
						items={snapshot.items}
						listAuthor={data.author.name}
						style={{ maxWidth: 1280, width: '100%', paddingBottom: 40 }}
					/>
				</Box>
			</UIProvider>
		</HubContextProvider>
	);
}
