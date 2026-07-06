import { hooks } from '@/stores/groceries/index.js';
import { Box, Field, Input } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useCallback } from 'react';

export interface RecipeTimeFieldsProps {
	recipe: Recipe;
}

export function RecipeTimeFields({ recipe }: RecipeTimeFieldsProps) {
	const { prepTimeMinutes, cookTimeMinutes, totalTimeMinutes } =
		hooks.useWatch(recipe);
	const updateComponentTime = useCallback(
		(key: 'prepTimeMinutes' | 'cookTimeMinutes', valueStr: string) => {
			const prevTotal = recipe.get('totalTimeMinutes') ?? 0;
			const prevComponentSum =
				(recipe.get('prepTimeMinutes') ?? 0) +
				(recipe.get('cookTimeMinutes') ?? 0);
			const totalIsSum = prevTotal === prevComponentSum;

			if (valueStr === '') {
				recipe.set(key, null);
			} else {
				const value = parseInt(valueStr);
				if (isNaN(value)) return;

				recipe.set(key, value);
			}
			if (totalIsSum) {
				recipe.set(
					'totalTimeMinutes',
					(recipe.get('prepTimeMinutes') ?? 0) +
						(recipe.get('cookTimeMinutes') ?? 0),
				);
			}
		},
		[recipe],
	);

	return (
		<Box col items="stretch" full="width" gap="xs">
			<Field stretch id="recipePrepTime">
				<Field.Label>Prep Time</Field.Label>
				<Field.Control
					render={
						<Input
							type="number"
							value={prepTimeMinutes?.toString() ?? '0'}
							onValueChange={(val) => {
								updateComponentTime('prepTimeMinutes', val);
							}}
							autoSelect
							endAccessory="min"
						/>
					}
				/>
			</Field>
			<Field stretch id="recipeCookTime">
				<Field.Label>Cook Time</Field.Label>
				<Field.Control
					render={
						<Input
							type="number"
							value={cookTimeMinutes?.toString() ?? '0'}
							onValueChange={(val) => {
								updateComponentTime('cookTimeMinutes', val);
							}}
							autoSelect
							endAccessory="min"
						/>
					}
				/>
			</Field>
			<Field stretch id="recipeTotalTime">
				<Field.Label>Total Time</Field.Label>
				<Field.Control
					render={
						<Input
							id="recipeTotalTime"
							type="number"
							value={totalTimeMinutes?.toString() ?? '0'}
							onValueChange={(val) => {
								if (val === '') {
									recipe.set('totalTimeMinutes', null);
									return;
								} else {
									const v = parseInt(val);
									if (isNaN(v)) return;
									recipe.set('totalTimeMinutes', v);
								}
							}}
							autoSelect
							endAccessory="min"
						/>
					}
				/>
			</Field>
		</Box>
	);
}
