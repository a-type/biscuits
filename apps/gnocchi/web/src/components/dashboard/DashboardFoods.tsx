import { hooks } from '@/stores/groceries/index.js';
import { Card, Chip, H4, Icon, RelativeTime } from '@a-type/ui';
import { Food } from '@gnocchi.biscuits/verdant';
import { FoodName } from '../foods/FoodName.jsx';
import { CardContent, CardTitle, DashboardContent } from './common.js';

export interface DashboardFoodsProps {
	className?: string;
}

export function DashboardFoods({ className }: DashboardFoodsProps) {
	const [recentFoodsUnfiltered] = hooks.useAllFoodsPaginated({
		pageSize: 7,
		index: {
			where: 'lastPurchasedAtOrZero',
			order: 'desc',
		},
		key: 'dashboardRecent',
	});
	// frozen shows in other section.
	const recentFoods = recentFoodsUnfiltered.filter(
		(food) => food.get('inInventory') && !food.get('frozenAt'),
	);

	if (!recentFoods.length) return null;

	return (
		<DashboardContent className={className}>
			<H4>Recent foods</H4>
			<Card.Grid columns={3}>
				{recentFoods.map((item) => (
					<RecentFoodItem key={item.uid} item={item} />
				))}
			</Card.Grid>
		</DashboardContent>
	);
}

export function RecentFoodItem({ item }: { item: Food }) {
	const { lastPurchasedAt } = hooks.useWatch(item);
	return (
		<Card>
			<Card.Main compact>
				<CardTitle>
					<FoodName food={item} capitalize />
				</CardTitle>
				<CardContent>
					{lastPurchasedAt && (
						<Chip>
							<Icon name="calendar" />
							<RelativeTime value={lastPurchasedAt} abbreviate />
						</Chip>
					)}
				</CardContent>
			</Card.Main>
		</Card>
	);
}
