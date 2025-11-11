import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import {
	SearchAndBuyExperience,
	searchAndBuyExperienceFragment,
} from './buyExperience/SearchAndBuyExperience.js';
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
	ItemCardPrice,
	itemCardPriceFragment,
} from './cardParts/ItemCardPrice.js';
import {
	ItemCardPrompt,
	itemCardPromptFragment,
} from './cardParts/ItemCardPrompt.js';
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

export const ideaCardContentFragment = graphql(
	`
		fragment IdeaCardContent on PublicWishlistItem {
			id
			...ItemCardMain
			...ItemCardTypeChip
			...ItemCardPrompt
			...ItemCardTitle
			...ItemCardPrice
			...ItemCardPurchases
			...ItemCardNote
			...SearchAndBuyExperience
		}
	`,
	[
		itemCardMainFragment,
		itemCardTypeChipFragment,
		itemCardPromptFragment,
		itemCardTitleFragment,
		itemCardPriceFragment,
		itemCardPurchasesFragment,
		itemCardNoteFragment,
		searchAndBuyExperienceFragment,
	],
);

export interface IdeaCardContentProps {
	item: FragmentOf<typeof ideaCardContentFragment>;
	listAuthor: string;
	className?: string;
}

export function IdeaCardContent({
	item: itemMasked,
	listAuthor,
	className,
}: IdeaCardContentProps) {
	const item = readFragment(ideaCardContentFragment, itemMasked);
	return (
		<SearchAndBuyExperience
			item={item}
			listAuthor={listAuthor}
			description={`They added this idea to their list as inspiration. Does it
					give you any ideas of your own?`}
		>
			<ItemCardMain item={item} className={className}>
				<ItemCardTypeChip item={item} />
				<ItemCardPrompt item={item} />
				<ItemCardTitle item={item} />
				<ItemCardPrice item={item} />
				<ItemCardPurchases item={item} />
				<ItemCardNote item={item} />
				<ItemCardOpenCta />
			</ItemCardMain>
		</SearchAndBuyExperience>
	);
}
