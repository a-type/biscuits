import { Dialog, P } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { SearchButton } from '@wish-wash.biscuits/common';
import { ReactNode } from 'react';
import {
	ItemCardImageGallery,
	itemCardImageGalleryFragment,
} from '../cardParts/ItemCardImageGallery.js';

export const vibeCardBuyExperienceFragment = graphql(
	`
		fragment VibeCardBuyExperience on PublicWishlistItem {
			id
			description
			...ItemCardImageGallery
		}
	`,
	[itemCardImageGalleryFragment],
);

export function VibeCardBuyExperience({
	item: itemMasked,
	children,
}: {
	item: FragmentOf<typeof vibeCardBuyExperienceFragment>;
	children: ReactNode;
	listAuthor: string;
}) {
	const item = readFragment(vibeCardBuyExperienceFragment, itemMasked);
	return (
		<>
			<Dialog>
				<Dialog.Trigger asChild>{children}</Dialog.Trigger>
				<Dialog.Content width="lg">
					{item.description && <Dialog.Title>{item.description}</Dialog.Title>}
					<ItemCardImageGallery item={item} maxCols={3} />
					<P>Be on the lookout for stuff that feels like this.</P>
					<Dialog.Actions>
						{item.description && (
							<SearchButton prompt={item.description} className="mr-auto" />
						)}
						<Dialog.Close>Close</Dialog.Close>
					</Dialog.Actions>
				</Dialog.Content>
			</Dialog>
		</>
	);
}
