import { hooks } from '@/stores/groceries/index.js';
import { ActionButton, Icon } from '@a-type/ui';
import { Recipe, RecipeInit } from '@gnocchi.biscuits/verdant';
import { useNavigate } from '@verdant-web/react-router';
import { makeRecipeLink } from '../../makeRecipeLink.js';

export interface RecipeCloneActionProps {
	recipe: Recipe;
}

export function RecipeCloneAction({ recipe }: RecipeCloneActionProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<ActionButton
			onClick={async () => {
				// not using .clone because new recipe also needs a unique slug
				// and updated title
				const snap = recipe.getSnapshot() as RecipeInit;
				delete snap.id;
				delete snap.slug;
				snap.title = `${snap.title} (Copy)`;
				snap.copyOf = recipe.get('id');
				const copy = await client.recipes.put(snap, {
					access: recipe.access as any,
				});
				navigate(makeRecipeLink(copy, '/edit'));
			}}
		>
			<Icon name="copy" />
			Make copy
		</ActionButton>
	);
}
