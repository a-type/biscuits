import { FoodName } from '@/components/foods/FoodName.jsx';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Text,
} from '@a-type/ui';
import { Suspense } from 'react';

export function ManageFoodsButton() {
	return (
		<Dialog>
			<DialogTrigger render={<Button />}>Manage foods</DialogTrigger>
			<DialogContent>
				<DialogTitle>Manage foods</DialogTitle>
				<Suspense>
					<FoodsList />
				</Suspense>
				<DialogActions>
					<DialogClose />
				</DialogActions>
			</DialogContent>
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
