import { hooks } from '@/stores/groceries/index.js';
import { Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { makeRecipeLink } from '../makeRecipeLink.js';

export interface RecipeCopyOfTagProps {
	recipe: Recipe;
}

export function RecipeCopyOriginalLink({
	recipe,
	...rest
}: RecipeCopyOfTagProps) {
	const { copyOf } = hooks.useWatch(recipe);

	if (!copyOf) {
		return null;
	}

	return <CopyLinkContent copyOfId={copyOf} {...rest} />;
}

function CopyLinkContent({ copyOfId, ...rest }: { copyOfId: string }) {
	const copyOfRecipe = hooks.useRecipe(copyOfId);
	hooks.useWatch(copyOfRecipe);

	if (!copyOfRecipe) {
		return null;
	}

	return (
		<Link to={makeRecipeLink(copyOfRecipe)} {...rest}>
			<Icon name="copy" /> Copy of {truncate(copyOfRecipe.get('title'), 20)}
		</Link>
	);
}

function truncate(str: string, maxLength: number) {
	if (str.length <= maxLength) {
		return str;
	}
	return str.slice(0, maxLength - 3) + '...';
}
