import { Card, clsx } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardPromptFragment = graphql(`
	fragment ItemCardPrompt on PublicWishlistItem {
		id
		imageUrls
		prompt
	}
`);

export interface ItemCardPromptProps {
	item: FragmentOf<typeof itemCardPromptFragment>;
	className?: string;
}

export function ItemCardPrompt({
	item: itemMasked,
	className,
}: ItemCardPromptProps) {
	const item = readFragment(itemCardPromptFragment, itemMasked);
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
