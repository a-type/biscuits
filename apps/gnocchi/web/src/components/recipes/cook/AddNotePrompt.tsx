import { AppearWithScroll } from '@/components/recipes/cook/AppearWithScroll.jsx';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { P } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';

export interface AddNotePromptProps {
	recipe: Recipe;
}

export function AddNotePrompt({ recipe }: AddNotePromptProps) {
	return (
		<AppearWithScroll className="flex flex-col gap-2">
			<P>Any notes for next time?</P>
			<RecipeNote recipe={recipe} />
		</AppearWithScroll>
	);
}
