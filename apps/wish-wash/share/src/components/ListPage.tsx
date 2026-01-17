import { Box, Chip, H1, Switch, Provider as UIProvider } from '@a-type/ui';
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
					d="col"
					full="width"
					p
					gap="lg"
					items="center"
					className="flex-[1_0_auto]"
					data-testid="list-page"
				>
					<Box d="col" gap="lg" className="max-w-800px w-full">
						{snapshot.coverImageUrl && (
							<img
								src={snapshot.coverImageUrl}
								className="h-[20vh] w-full rounded-lg object-cover"
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
							className="flex-col md:flex-row"
							justify="between"
							items="start"
							full="width"
							gap
						>
							<Box surface color="primary" p>
								Click any item to see details and links
							</Box>
							<Box surface p items="center" render={<label />} gap>
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
						className="max-w-1280px w-full pb-10"
					/>
				</Box>
			</UIProvider>
		</HubContextProvider>
	);
}
