import { hooks } from '@/stores/groceries/index.js';
import { Card, Chip, H4, Icon, RelativeTime } from '@a-type/ui';
import { Food } from '@gnocchi.biscuits/verdant';
import { FoodName } from '../foods/FoodName.jsx';
import { useExpiresSoonItems } from '../pantry/hooks.js';
import { CardContent, CardTitle, DashboardContent } from './common.js';

export interface DashboardExpiresSoonProps {
	className?: string;
}

export function DashboardExpiresSoon({ className }: DashboardExpiresSoonProps) {
	const expiresSoonItems = useExpiresSoonItems();

	if (expiresSoonItems.length === 0) return null;

	return (
		<DashboardContent className={className}>
			<H4>Expiring soon</H4>
			<Card.Grid columns={Math.floor(expiresSoonItems.length / 3) + 1}>
				{expiresSoonItems.map((item) => (
					<ExpiresSoonItem key={item.uid} item={item} />
				))}
			</Card.Grid>
		</DashboardContent>
	);
}

export function ExpiresSoonItem({ item }: { item: Food }) {
	const { expiresAt } = hooks.useWatch(item);

	return (
		<Card>
			<Card.Main compact>
				<CardTitle>
					<FoodName food={item} capitalize />
				</CardTitle>
				<CardContent>
					{expiresAt && (
						<Chip color="primary">
							<Icon name="clock" />
							<RelativeTime value={expiresAt} abbreviate />
						</Chip>
					)}
				</CardContent>
			</Card.Main>
		</Card>
	);
}
