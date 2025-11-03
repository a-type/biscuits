import { hooks } from '@/stores/groceries/index.js';
import { Button } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useNavigate } from '@verdant-web/react-router';

export interface RecipeDeleteButtonProps {
	recipe: Recipe;
	className?: string;
}

export function RecipeDeleteButton({
	recipe,
	...rest
}: RecipeDeleteButtonProps) {
	const client = hooks.useClient();

	const navigate = useNavigate();

	return (
		<Button
			{...rest}
			emphasis="primary"
			color="attention"
			onClick={() => {
				client.recipes.delete(recipe.get('id'));
				navigate('/recipes');
			}}
		>
			Delete
		</Button>
	);
}
