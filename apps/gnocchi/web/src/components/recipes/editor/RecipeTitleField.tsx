import { hooks } from '@/stores/groceries/index.js';
import { LiveUpdateTextField } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';

export interface RecipeTitleFieldProps {
	recipe: Recipe;
}

export function RecipeTitleField({ recipe }: RecipeTitleFieldProps) {
	const { title } = hooks.useWatch(recipe);

	return (
		<LiveUpdateTextField
			textArea
			value={title}
			onChange={(value) => {
				recipe.update({
					title: value,
					updatedAt: Date.now(),
				});
			}}
			className="important:text-3xl max-w-full w-full"
			autoSelect
		/>
	);
}
