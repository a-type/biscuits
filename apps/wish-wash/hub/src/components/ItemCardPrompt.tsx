import { HubWishlistItem } from '@/types.js';
import { Card, clsx } from '@a-type/ui';

export interface ItemCardPromptProps {
	item: HubWishlistItem;
	className?: string;
}

export function ItemCardPrompt({ item, className }: ItemCardPromptProps) {
	if (!item.prompt) return null;
	const hasImage = item.imageUrls.length > 0;

	return (
		<Card.Content
			unstyled={!hasImage}
			className={clsx(
				'text-sm',
				!hasImage ? 'p-xs text-sm color-primary-ink' : 'px-md',
				className,
			)}
		>
			{item.prompt}
		</Card.Content>
	);
}
