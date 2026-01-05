import { Dialog, P } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { SearchButton } from '@wish-wash.biscuits/common';
import { ReactElement } from 'react';
import {
	ItemCardImageGallery,
	itemCardImageGalleryFragment,
} from '../cardParts/ItemCardImageGallery.js';
import { ItemCardPurchaseButton } from '../cardParts/ItemCardPurchaseButton.js';
import {
	ItemCardTypeChip,
	itemCardTypeChipFragment,
} from '../cardParts/ItemCardTypeChip.js';

export const vibeCardBuyExperienceFragment = graphql(
	`
		fragment VibeCardBuyExperience on PublicWishlistItem {
			id
			description
			...ItemCardImageGallery
			...ItemCardTypeChip
		}
	`,
	[itemCardImageGalleryFragment, itemCardTypeChipFragment],
);

export function VibeCardBuyExperience({
	item: itemMasked,
	children,
}: {
	item: FragmentOf<typeof vibeCardBuyExperienceFragment>;
	children: ReactElement;
	listAuthor: string;
}) {
	const item = readFragment(vibeCardBuyExperienceFragment, itemMasked);
	return (
		<>
			<Dialog>
				<Dialog.Trigger render={children} />
				<Dialog.Content width="lg" className="gap-md">
					<ItemCardTypeChip item={item} className="mr-auto" />
					{item.description && <Dialog.Title>{item.description}</Dialog.Title>}
					<ItemCardImageGallery item={item} maxCols={3} />
					<P>Be on the lookout for stuff that feels like this.</P>
					{item.description && (
						<SearchButton prompt={item.description} className="mr-auto" />
					)}
					<Dialog.Actions>
						<ItemCardPurchaseButton
							size="default"
							itemId={item.id}
							className="mr-auto"
						/>
						<Dialog.Close>Close</Dialog.Close>
					</Dialog.Actions>
				</Dialog.Content>
			</Dialog>
		</>
	);
}
