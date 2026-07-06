import { AppearWithScroll } from '@/components/recipes/cook/AppearWithScroll.jsx';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { Box, P } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';

export interface AddNotePromptProps {
	recipe: Recipe;
}

export function AddNotePrompt({ recipe }: AddNotePromptProps) {
	return (
		<AppearWithScroll>
			<Box col gap="sm">
				<P>Any notes for next time?</P>
				<RecipeNote recipe={recipe} />
			</Box>
		</AppearWithScroll>
	);
}
