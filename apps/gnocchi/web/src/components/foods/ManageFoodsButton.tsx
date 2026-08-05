import { FoodName } from '@/components/foods/FoodName.jsx';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Box, Button, Dialog, Text } from '@a-type/ui';
import { Suspense } from 'react';

export function ManageFoodsButton() {
	return (
		<Dialog>
			<Dialog.Trigger render={<Button />}>Manage foods</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Manage foods</Dialog.Title>
				<Suspense>
					<FoodsList />
				</Suspense>
				<Dialog.Actions>
					<Dialog.Close />
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}

function FoodsList() {
	const foods = hooks.useAllFoods();

	return (
		<Box col>
			{foods.map((food) => (
				<Box key={food.get('canonicalName')} gap justify="between" p="sm">
					<Box grow>
						<Text emphasis="secondary">
							<FoodName food={food} />
						</Text>
					</Box>
					<OpenFoodDetailButton foodName={food.get('canonicalName')} />
				</Box>
			))}
		</Box>
	);
}
