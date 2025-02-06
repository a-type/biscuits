import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	ButtonProps,
	Card,
	clsx,
	Dialog,
	Input,
} from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useCombobox } from 'downshift';
import { Suspense, useState } from 'react';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';

export interface IncludeSubRecipeProps
	extends Omit<ButtonProps, 'onSelect' | 'onClick'> {
	onSelect: (recipe: Recipe) => void;
}

export function IncludeSubRecipe({
	onSelect,
	className,
	...rest
}: IncludeSubRecipeProps) {
	const [open, setOpen] = useState(false);

	const handleSelect = (recipe: Recipe) => {
		onSelect(recipe);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<Button
					{...rest}
					className={clsx('opacity-50 hover:opacity-100', className)}
				>
					Embed a recipe
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Select a recipe</Dialog.Title>
				<Suspense>
					<SubRecipeSearch onSelect={handleSelect} />
				</Suspense>
				<Dialog.Actions>
					<Dialog.Close asChild>
						<Button>Cancel</Button>
					</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}

function SubRecipeSearch({ onSelect }: IncludeSubRecipeProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const searchWord = searchTerm.split(/\s+/).pop();
	const { data: recipes } = hooks.useAllRecipesUnsuspended({
		index: {
			where: 'generalSearch',
			startsWith: searchWord,
		},
		skip: searchTerm.length < 3,
		key: 'sub-recipe-search',
	});

	const filteredRecipes =
		recipes?.filter((recipe) => {
			const title = recipe.get('title');
			return title.toLowerCase().includes(searchTerm.toLowerCase());
		}) ?? [];

	const { getInputProps, getItemProps, getMenuProps } = useCombobox({
		items: filteredRecipes,
		onInputValueChange: ({ inputValue }) => {
			setSearchTerm(inputValue);
		},
		inputValue: searchTerm,
		onSelectedItemChange: ({ selectedItem }) => {
			onSelect(selectedItem);
			setSearchTerm('');
		},
		itemToString: (recipe) => recipe?.get('title') ?? '',
	});

	return (
		<Box direction="col" gap="md">
			<Input {...getInputProps()} placeholder="Search..." />
			<div
				className="flex-1 w-full max-h-[50vh] overflow-auto"
				{...getMenuProps()}
			>
				<Card.Grid>
					{filteredRecipes.map((recipe) => (
						<Card key={recipe.get('id')}>
							<Card.Main {...getItemProps({ item: recipe })}>
								<Card.Title>{recipe.get('title')}</Card.Title>
							</Card.Main>
							<Card.Image>
								<RecipeMainImageViewer
									recipe={recipe}
									className="w-full h-full"
								/>
							</Card.Image>
						</Card>
					))}
				</Card.Grid>
			</div>
		</Box>
	);
}
