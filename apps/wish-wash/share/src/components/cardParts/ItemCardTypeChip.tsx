import { Card, Chip, clsx, Icon } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { typeIcons } from '@wish-wash.biscuits/common';

export const itemCardTypeChipFragment = graphql(`
	fragment ItemCardTypeChip on PublicWishlistItem {
		id
		type
	}
`);

export interface ItemCardTypeChipProps {
	item: FragmentOf<typeof itemCardTypeChipFragment>;
	className?: string;
}

export function ItemCardTypeChip({
	item: itemMasked,
	className,
}: ItemCardTypeChipProps) {
	const item = readFragment(itemCardTypeChipFragment, itemMasked);
	return (
		<Card.Content unstyled className={clsx('pt-2 pl-1', className)}>
			<Chip color="primary" className="inline-flex">
				<Icon name={typeIcons[item.type]} />
				{item.type}
			</Chip>
		</Card.Content>
	);
}
