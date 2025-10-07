import { HubWishlistItem } from '@/types.js';
import { ItemCardMain } from './ItemCardMain.js';
import { ItemCardNote } from './ItemCardNote.js';
import { ItemCardPrice } from './ItemCardPrice.js';
import { ItemCardPrompt } from './ItemCardPrompt.js';
import { ItemCardPurchases } from './ItemCardPurchases.js';
import { ItemCardTitle } from './ItemCardTitle.js';
import { ItemCardTypeChip } from './ItemCardTypeChip.js';
import { SearchAndBuyExperience } from './SearchAndBuyExperience.js';

export interface IdeaCardContentProps {
	item: HubWishlistItem;
	listAuthor: string;
	className?: string;
}

export function IdeaCardContent({
	item,
	listAuthor,
	className,
}: IdeaCardContentProps) {
	return (
		<SearchAndBuyExperience
			item={item}
			listAuthor={listAuthor}
			description={`${listAuthor} added this idea to their list as inspiration. Does it
					give you any ideas of your own?`}
		>
			<ItemCardMain item={item} className={className}>
				<ItemCardTypeChip item={item} />
				<ItemCardPrompt item={item} />
				<ItemCardTitle item={item} />
				<ItemCardPrice item={item} />
				<ItemCardPurchases item={item} />
				<ItemCardNote item={item} />
			</ItemCardMain>
		</SearchAndBuyExperience>
	);
}
