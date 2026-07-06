import { Box, Dialog } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { SearchButton, searchProviders } from '@wish-wash.biscuits/common';
import { ReactNode } from 'react';
import {
	ItemCardImageGallery,
	itemCardImageGalleryFragment,
} from '../cardParts/ItemCardImageGallery.js';
import {
	ItemCardPurchases,
	itemCardPurchasesFragment,
} from '../cardParts/ItemCardPurchases.js';
import {
	ItemCardTypeChip,
	itemCardTypeChipFragment,
} from '../cardParts/ItemCardTypeChip.js';

export const preBuyExperienceContentFragment = graphql(
	`
		fragment PreBuyExperienceContent on PublishedWishlistItem {
			id
			description
			...ItemCardImageGallery
			...ItemCardPurchases
			...ItemCardTypeChip
		}
	`,
	[
		itemCardImageGalleryFragment,
		itemCardPurchasesFragment,
		itemCardTypeChipFragment,
	],
);

export function PreBuyExperienceContent({
	item: itemMasked,
	description,
	listAuthor,
}: {
	item: FragmentOf<typeof preBuyExperienceContentFragment>;
	description?: ReactNode;
	listAuthor: string;
}) {
	const item = readFragment(preBuyExperienceContentFragment, itemMasked);
	return (
		<>
			<ItemCardTypeChip item={item} style={{ marginRight: 'auto' }} />
			<Dialog.Title>Search for {item.description}</Dialog.Title>
			<ItemCardImageGallery item={item} />
			<ItemCardPurchases
				item={item}
				style={{
					marginRight: 'auto',
					backgroundColor: 'var(--m-color-accent-wash)',
				}}
			/>
			<Dialog.Description>
				{description || (
					<>
						Find something online that fits the bill, then come back here to
						tell {listAuthor} you bought it!
					</>
				)}
			</Dialog.Description>
			<Box wrap gap items="center">
				{searchProviders.map((provider) => (
					<SearchButton prompt={item.description} provider={provider} />
				))}
			</Box>
		</>
	);
}
