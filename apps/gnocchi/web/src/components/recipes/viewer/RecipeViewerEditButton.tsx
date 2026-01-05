import { Link } from '@/components/nav/Link.jsx';
import { ActionButton, ActionButtonProps, Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { makeRecipeLink } from '../makeRecipeLink.js';

export interface RecipeViewerEditButtonProps extends ActionButtonProps {
	recipe: Recipe;
}

export function RecipeViewerEditButton({
	recipe,
	...rest
}: RecipeViewerEditButtonProps) {
	return (
		<ActionButton
			{...rest}
			render={<Link to={makeRecipeLink(recipe, '/edit')} />}
		>
			<Icon name="pencil" />
			Edit
		</ActionButton>
	);
}
