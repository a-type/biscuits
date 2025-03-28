import { RecipeTimeFields } from '@/components/recipes/editor/RecipeTimeFields.jsx';
import { HeaderBar } from '@/components/recipes/layout/HeaderBar.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { H2, LiveUpdateTextField } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { RecipeNotFound } from '../RecipeNotFound.jsx';
import { useRecipeFromSlugUrl, useWatchChanges } from '../hooks.js';
import {
	ImageContainer,
	TitleAndImageLayout,
	TitleContainer,
} from '../layout/TitleAndImageLayout.jsx';
import { InstructionsProvider } from './InstructionStepNodeView.jsx';
import { NoteEditor } from './NoteEditor.jsx';
import { RecipeDeleteButton } from './RecipeDeleteButton.jsx';
import { RecipeEditActions } from './RecipeEditActions.jsx';
import { RecipeIngredientsEditor } from './RecipeIngredientsEditor.jsx';
import { RecipeInstructionsField } from './RecipeInstructionsField.jsx';
import { RecipeMainImageEditor } from './RecipeMainImageEditor.jsx';
import { RecipePreludeEditor } from './RecipePreludeEditor.jsx';
import { RecipeTagsEditor } from './RecipeTagsEditor.jsx';
import { RecipeTitleField } from './RecipeTitleField.jsx';
import { RecipeUrlField } from './RecipeUrlField.jsx';

export interface RecipeEditorProps {
	slug: string;
}

export function RecipeEditor({ slug }: RecipeEditorProps) {
	const recipe = useRecipeFromSlugUrl(slug);

	if (!recipe) return <RecipeNotFound />;

	return <RecipeEditorContent recipe={recipe} />;
}

function RecipeEditorContent({ recipe }: { recipe: Recipe }) {
	useWatchChanges(recipe);

	usePageTitle('Editing ' + recipe.get('title').slice(0, 20));

	return (
		<div className="flex flex-col gap-8">
			<HeaderBar backUrl={makeRecipeLink(recipe, '')}>
				<RecipeEditActions />
			</HeaderBar>
			<div className="flex flex-col gap-2">
				<TitleAndImageLayout>
					<TitleContainer>
						<RecipeTitleField recipe={recipe} />
					</TitleContainer>
					<ImageContainer>
						<RecipeMainImageEditor recipe={recipe} />
					</ImageContainer>
				</TitleAndImageLayout>
				<RecipeUrlField recipe={recipe} />
			</div>
			<RecipeTagsEditor recipe={recipe} />
			<div>
				<H2 className="gutter-bottom">Description</H2>
				<RecipePreludeEditor recipe={recipe} />
			</div>
			<RecipeNoteEditor recipe={recipe} />
			<RecipeTimeFields recipe={recipe} />
			<label className="flex flex-row items-center justify-between mt-1">
				<span>Servings</span>
				<LiveUpdateTextField
					value={recipe.get('servings')?.toString() ?? ''}
					onChange={(value) => {
						const asNumber = parseInt(value, 10);
						if (isNaN(asNumber)) return;
						recipe.set('servings', asNumber);
					}}
					type="number"
					className="w-24"
				/>
			</label>
			<div>
				<H2 className="gutter-bottom">Ingredients</H2>
				<RecipeIngredientsEditor recipe={recipe} />
			</div>
			<div>
				<InstructionsProvider isEditing recipeId={recipe.get('id')}>
					<H2 className="gutter-bottom">Instructions</H2>
					<RecipeInstructionsField recipe={recipe} />
				</InstructionsProvider>
			</div>
			<div>
				<H2 className="gutter-bottom">Danger zone</H2>
				<RecipeDeleteButton className="self-start" recipe={recipe} />
			</div>
		</div>
	);
}

function RecipeNoteEditor({ recipe }: { recipe: Recipe }) {
	const { note } = hooks.useWatch(recipe);
	return (
		<NoteEditor
			value={note ?? ''}
			onChange={(v) => recipe.set('note', v)}
			className="self-start"
		/>
	);
}
