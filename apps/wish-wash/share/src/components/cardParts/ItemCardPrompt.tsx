import { Card, clsx } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardPromptFragment = graphql(`
	fragment ItemCardPrompt on PublishedWishlistItem {
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
	return <Card.Content className={clsx(className)}>{item.prompt}</Card.Content>;
}
