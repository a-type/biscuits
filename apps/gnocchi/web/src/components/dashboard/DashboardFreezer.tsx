import { hooks } from '@/stores/groceries/index.js';
import { Card, Chip, H4, Icon, RelativeTime, Tooltip } from '@a-type/ui';
import { Food } from '@gnocchi.biscuits/verdant';
import { FoodName } from '../foods/FoodName.jsx';
import { CardContent, CardTitle, DashboardContent } from './common.js';

export interface DashboardFreezerProps {
	className?: string;
}

export function DashboardFreezer({ className }: DashboardFreezerProps) {
	const [frozenFoodsUnfiltered] = hooks.useAllFoodsPaginated({
		pageSize: 20,
		index: {
			where: 'frozen',
			equals: true,
		},
		key: 'dashboardFrozen',
	});
	// frozen shows in other section.
	const frozenFoods = frozenFoodsUnfiltered.filter((food) =>
		food.get('inInventory'),
	);

	if (!frozenFoods.length) return null;

	return (
		<DashboardContent className={className}>
			<H4>Freezer</H4>
			<Card.Grid columns={3}>
				{frozenFoods.map((item) => (
					<FreezerFoodItem key={item.uid} item={item} />
				))}
			</Card.Grid>
		</DashboardContent>
	);
}

export function FreezerFoodItem({ item }: { item: Food }) {
	const { frozenAt } = hooks.useWatch(item);
	return (
		<Card className="border-accent-dark">
			<Card.Main compact>
				<CardTitle>
					<FoodName food={item} capitalize />
				</CardTitle>
				<CardContent>
					{frozenAt && (
						<Tooltip content="You marked this item as frozen">
							<Chip color="accent">
								<Icon name="snowflake" />
								<RelativeTime value={frozenAt} abbreviate />
							</Chip>
						</Tooltip>
					)}
				</CardContent>
			</Card.Main>
		</Card>
	);
}
