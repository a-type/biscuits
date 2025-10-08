import { Dialog } from '@a-type/ui';
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

export const preBuyExperienceContentFragment = graphql(
	`
		fragment PreBuyExperienceContent on PublicWishlistItem {
			id
			description
			...ItemCardImageGallery
			...ItemCardPurchases
		}
	`,
	[itemCardImageGalleryFragment, itemCardPurchasesFragment],
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
			<Dialog.Title>Search for {item.description}</Dialog.Title>
			<ItemCardImageGallery item={item} maxCols={2} />
			<ItemCardPurchases item={item} className="!bg-accent-wash mr-auto" />
			<Dialog.Description>
				{description || (
					<>
						Find something online that fits the bill, then come back here to
						tell {listAuthor} you bought it!
					</>
				)}
			</Dialog.Description>
			<div className="row flex-wrap">
				{searchProviders.map((provider) => (
					<SearchButton prompt={item.description} provider={provider} />
				))}
			</div>
		</>
	);
}
