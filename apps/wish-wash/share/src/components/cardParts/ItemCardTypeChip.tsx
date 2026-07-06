import { Card, Chip, Icon } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { typeIcons } from '@wish-wash.biscuits/common';

export const itemCardTypeChipFragment = graphql(`
	fragment ItemCardTypeChip on PublishedWishlistItem {
		id
		type
	}
`);

export interface ItemCardTypeChipProps {
	item: FragmentOf<typeof itemCardTypeChipFragment>;
	className?: string;
	style?: React.CSSProperties;
}

export function ItemCardTypeChip({
	item: itemMasked,
	className,
	...rest
}: ItemCardTypeChipProps) {
	const item = readFragment(itemCardTypeChipFragment, itemMasked);
	return (
		<Card.Content unstyled className={className} {...rest}>
			<Chip emphasis="primary">
				<Icon name={typeIcons[item.type]} />
				{item.type}
			</Chip>
		</Card.Content>
	);
}
