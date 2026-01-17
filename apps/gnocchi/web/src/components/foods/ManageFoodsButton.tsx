import { FoodName } from '@/components/foods/FoodName.jsx';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
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
		<div className="flex flex-col">
			{foods.map((food) => (
				<div
					key={food.get('canonicalName')}
					className="flex flex-row justify-between gap-4 p-2"
				>
					<div className="flex flex-1 text-md font-bold">
						<FoodName food={food} />
					</div>
					<OpenFoodDetailButton foodName={food.get('canonicalName')} />
				</div>
			))}
		</div>
	);
}
