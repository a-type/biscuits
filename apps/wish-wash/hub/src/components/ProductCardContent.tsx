import { HubWishlistItem } from '@/types.js';
import { FormikForm as BaseFormikForm } from '@a-type/ui';
import { ItemCardMain } from './ItemCardMain.jsx';
import { ItemCardNote } from './ItemCardNote.jsx';
import { ItemCardPrice } from './ItemCardPrice.jsx';
import { ItemCardPurchases } from './ItemCardPurchases.jsx';
import { ItemCardTitle } from './ItemCardTitle.jsx';
import { ItemCardTypeChip } from './ItemCardTypeChip.jsx';
import { LinkBuyExperience } from './LinkBuyExperience.jsx';

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
