import { FormikForm as BaseFormikForm } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import {
	LinkBuyExperience,
	linkBuyExperienceFragment,
} from './buyExperience/LinkBuyExperience.js';
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

export const productCardContentFragment = graphql(
	`
		fragment ProductCardContent on PublicWishlistItem {
			id
			...ItemCardMain
			...ItemCardTypeChip
			...ItemCardTitle
			...ItemCardPrice
			...ItemCardPurchases
			...ItemCardNote
			...LinkBuyExperience
		}
	`,
	[
		itemCardMainFragment,
		itemCardTypeChipFragment,
		itemCardPriceFragment,
		itemCardPurchasesFragment,
		itemCardNoteFragment,
		itemCardTitleFragment,
		linkBuyExperienceFragment,
	],
);

export const FormikForm = BaseFormikForm as any;

export interface ProductCardContentProps {
	item: FragmentOf<typeof productCardContentFragment>;
	className?: string;
	listAuthor: string;
}

export function ProductCardContent({
	item: itemMasked,
	className,
	listAuthor,
}: ProductCardContentProps) {
	const item = readFragment(productCardContentFragment, itemMasked);
	return (
		<LinkBuyExperience item={item} listAuthor={listAuthor}>
			<ItemCardMain item={item} className={className}>
				<ItemCardTypeChip item={item} />
				<ItemCardTitle item={item} />
				<ItemCardPrice item={item} />
				<ItemCardPurchases item={item} />
				<ItemCardNote item={item} />
				<ItemCardOpenCta />
			</ItemCardMain>
		</LinkBuyExperience>
	);
}
