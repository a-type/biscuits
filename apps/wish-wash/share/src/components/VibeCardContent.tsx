import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import {
	VibeCardBuyExperience,
	vibeCardBuyExperienceFragment,
} from './buyExperience/VibeCardBuyExperience.js';
import {
	ItemCardMain,
	itemCardMainFragment,
} from './cardParts/ItemCardMain.js';
import {
	ItemCardNote,
	itemCardNoteFragment,
} from './cardParts/ItemCardNote.js';
import { ItemCardOpenCta } from './cardParts/ItemCardOpenCta.js';
import {
	ItemCardPurchases,
	itemCardPurchasesFragment,
} from './cardParts/ItemCardPurchases.js';
import {
	ItemCardTitle,
	itemCardTitleFragment,
} from './cardParts/ItemCardTitle.js';
import {
	ItemCardTypeChip,
	itemCardTypeChipFragment,
} from './cardParts/ItemCardTypeChip.js';

export const vibeCardContentFragment = graphql(
	`
		fragment VibeCardContent on PublicWishlistItem {
			id
			...ItemCardMain
			...ItemCardTypeChip
			...ItemCardTitle
			...ItemCardPurchases
			...ItemCardNote
			...VibeCardBuyExperience
		}
	`,
	[
		itemCardMainFragment,
		itemCardTypeChipFragment,
		itemCardTitleFragment,
		itemCardPurchasesFragment,
		itemCardNoteFragment,
		vibeCardBuyExperienceFragment,
	],
);

export interface VibeCardContentProps {
	item: FragmentOf<typeof vibeCardContentFragment>;
	className?: string;
	listAuthor: string;
}

export function VibeCardContent({
	item: itemMasked,
	className,
	listAuthor,
}: VibeCardContentProps) {
	const item = readFragment(vibeCardContentFragment, itemMasked);
	return (
		<VibeCardBuyExperience item={item} listAuthor={listAuthor}>
			<ItemCardMain item={item} className={className}>
				<ItemCardTypeChip item={item} />
				<ItemCardTitle item={item} />
				<ItemCardPurchases item={item} />
				<ItemCardNote item={item} />
				<ItemCardOpenCta />
			</ItemCardMain>
		</VibeCardBuyExperience>
	);
}
