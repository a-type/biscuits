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
			style={{ maxWidth: '100%', width: '100%' }}
			className="@mode-heading"
			autoSelect
		/>
	);
}
