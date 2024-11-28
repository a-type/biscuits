import { CardGrid, cardGridColumns, H2 } from '@a-type/ui';
import classNames from 'classnames';
import { useExpiresSoonItems } from '../hooks.js';
import { PantryListItem } from '../items/PantryListItem.jsx';

export interface ExpiresSoonSectionProps {
	className?: string;
}

export function ExpiresSoonSection({ className }: ExpiresSoonSectionProps) {
	const expiresSoonItems = useExpiresSoonItems();

	if (expiresSoonItems.length === 0) return null;

	return (
		<div className={classNames('flex flex-col mb-6', className)}>
			<H2 className="important:text-md gutter-bottom ml-3">Expiring soon</H2>
			<CardGrid columns={cardGridColumns.default}>
				{expiresSoonItems.map((item) => (
					<PantryListItem
						item={item}
						key={item.get('canonicalName')}
						showLabels
						snoozable
					/>
				))}
			</CardGrid>
		</div>
	);
}
