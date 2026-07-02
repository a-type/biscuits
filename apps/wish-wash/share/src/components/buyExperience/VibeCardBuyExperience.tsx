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
		fragment VibeCardBuyExperience on PublishedWishlistItem {
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
				<Dialog.Content width="lg">
					<ItemCardTypeChip item={item} style={{ marginRight: 'auto' }} />
					{item.description && <Dialog.Title>{item.description}</Dialog.Title>}
					<ItemCardImageGallery item={item} />
					<P>Be on the lookout for stuff that feels like this.</P>
					{item.description && (
						<SearchButton
							prompt={item.description}
							style={{ marginRight: 'auto' }}
						/>
					)}
					<Dialog.Actions>
						<ItemCardPurchaseButton
							size="default"
							itemId={item.id}
							style={{ marginRight: 'auto' }}
						/>
						<Dialog.Close>Close</Dialog.Close>
					</Dialog.Actions>
				</Dialog.Content>
			</Dialog>
		</>
	);
}
