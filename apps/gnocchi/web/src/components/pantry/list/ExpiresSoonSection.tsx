import { CardGrid, cardGridColumns, Heading } from '@a-type/ui';
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
			<Heading emphasis="ambient" bold render={<h2 />} className={cls.title}>
				Expiring soon
			</Heading>
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
