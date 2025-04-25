import { HubWishlistItem } from '@/types.js';
import { ItemCardMain } from './ItemCardMain.jsx';
import { ItemCardNote } from './ItemCardNote.jsx';
import { ItemCardPrice } from './ItemCardPrice.jsx';
import { ItemCardPrompt } from './ItemCardPrompt.jsx';
import { ItemCardPurchases } from './ItemCardPurchases.jsx';
import { ItemCardTitle } from './ItemCardTitle.jsx';
import { ItemCardTypeChip } from './ItemCardTypeChip.jsx';
import { SearchAndBuyExperience } from './SearchAndBuyExperience.jsx';

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
