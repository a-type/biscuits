import { CardGrid, cardGridColumns, H2 } from '@a-type/ui';
import classNames from 'classnames';
import { useExpiresSoonItems } from '../hooks.js';
import { PantryListItem } from '../items/PantryListItem.jsx';
import cls from './ExpiresSoonSection.module.css';

export interface ExpiresSoonSectionProps {
	className?: string;
}

export function ExpiresSoonSection({ className }: ExpiresSoonSectionProps) {
	const expiresSoonItems = useExpiresSoonItems();

	if (expiresSoonItems.length === 0) return null;

	return (
		<div className={classNames(cls.root, className)}>
			<H2 className={cls.title}>Expiring soon</H2>
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
