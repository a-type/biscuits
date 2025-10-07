import { HubWishlistItem } from '@/types.js';
import { FormikForm as BaseFormikForm } from '@a-type/ui';
import { ItemCardMain } from './ItemCardMain.js';
import { ItemCardNote } from './ItemCardNote.js';
import { ItemCardPrice } from './ItemCardPrice.js';
import { ItemCardPurchases } from './ItemCardPurchases.js';
import { ItemCardTitle } from './ItemCardTitle.js';
import { ItemCardTypeChip } from './ItemCardTypeChip.js';
import { LinkBuyExperience } from './LinkBuyExperience.js';

export const FormikForm = BaseFormikForm as any;

export interface ProductCardContentProps {
	item: HubWishlistItem;
	className?: string;
	listAuthor: string;
}

export function ProductCardContent({
	item,
	className,
	listAuthor,
}: ProductCardContentProps) {
	return (
		<LinkBuyExperience item={item} listAuthor={listAuthor}>
			<ItemCardMain item={item} className={className}>
				<ItemCardTypeChip item={item} />
				<ItemCardTitle item={item} />
				<ItemCardPrice item={item} />
				<ItemCardPurchases item={item} />
				<ItemCardNote item={item} />
			</ItemCardMain>
		</LinkBuyExperience>
	);
}
