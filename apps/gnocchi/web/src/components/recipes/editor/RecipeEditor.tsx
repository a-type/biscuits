import { RecipeTimeFields } from '@/components/recipes/editor/RecipeTimeFields.jsx';
import { HeaderBar } from '@/components/recipes/layout/HeaderBar.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Box, Field, H2, LiveUpdateTextField } from '@a-type/ui';
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
import { RecipeTagsFullEditor } from './RecipeTagsFullEditor.jsx';
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
		<Box col gap="xl">
			<HeaderBar backUrl={makeRecipeLink(recipe, '')}>
				<RecipeEditActions />
			</HeaderBar>
			<Box col gap="sm">
				<TitleAndImageLayout>
					<TitleContainer>
						<RecipeTitleField recipe={recipe} />
					</TitleContainer>
					<ImageContainer>
						<RecipeMainImageEditor recipe={recipe} />
					</ImageContainer>
				</TitleAndImageLayout>
				<RecipeUrlField recipe={recipe} />
			</Box>
			<RecipeTagsFullEditor recipe={recipe} />
			<div>
				<H2>Description</H2>
				<RecipePreludeEditor recipe={recipe} />
			</div>
			<RecipeNoteEditor recipe={recipe} />
			<RecipeTimeFields recipe={recipe} />
			<Field stretch id="servings">
				<Field.Label>Servings</Field.Label>
				<Field.Control
					render={
						<LiveUpdateTextField
							value={recipe.get('servings')?.toString() ?? ''}
							onChange={(value) => {
								const asNumber = parseInt(value, 10);
								if (isNaN(asNumber)) return;
								recipe.set('servings', asNumber);
							}}
							type="number"
							style={{ width: 100 }}
						/>
					}
				/>
			</Field>
			<div>
				<H2>Ingredients</H2>
				<RecipeIngredientsEditor recipe={recipe} />
			</div>
			<div>
				<InstructionsProvider isEditing recipeId={recipe.get('id')}>
					<H2>Instructions</H2>
					<RecipeInstructionsField recipe={recipe} />
				</InstructionsProvider>
			</div>
			<div>
				<H2>Danger zone</H2>
				<RecipeDeleteButton style={{ alignSelf: 'start' }} recipe={recipe} />
			</div>
		</Box>
	);
}

function RecipeNoteEditor({ recipe }: { recipe: Recipe }) {
	const { note } = hooks.useWatch(recipe);
	return (
		<NoteEditor
			value={note ?? ''}
			onChange={(v) => recipe.set('note', v)}
			style={{ alignSelf: 'start' }}
		/>
	);
}
