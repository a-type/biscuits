import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemIndicator,
	DropdownMenuItemRightSlot,
	DropdownMenuTrigger,
	FormikForm,
	Icon,
	SubmitButton,
	TextAreaField,
	TextField,
} from '@a-type/ui';
import { useSessionStorage } from '@biscuits/client';
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Recipe,
	RecipeIngredients,
	RecipeIngredientsItem,
} from '@gnocchi.biscuits/verdant';
import { CheckIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { Suspense, useState } from 'react';
import { useSubRecipeIds } from '../hooks.js';
import { NoteEditor } from './NoteEditor.jsx';
import { SubRecipeEditorButton } from './SubRecipeEditorButton.jsx';

export interface RecipeIngredientsEditorProps {
	recipe: Recipe;
}

export function RecipeIngredientsEditor({
	recipe,
}: RecipeIngredientsEditorProps) {
	const { ingredients, id } = hooks.useWatch(recipe);
	hooks.useWatch(ingredients);
	const ids = ingredients.map((ingredient) => ingredient.get('id'));

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	return (
		<div className="border-light rounded-lg p-2">
			<DndContext
				sensors={sensors}
				onDragEnd={({ active, over }) => {
					if (active?.id && over?.id && active.id !== over.id) {
						const oldIndex = ids.indexOf(active.id as string);
						const newIndex = ids.indexOf(over.id as string);
						ingredients.move(oldIndex, newIndex);
					}
				}}
			>
				<SortableContext items={ids} strategy={verticalListSortingStrategy}>
					<div className="flex flex-col gap-2">
						{ingredients
							.filter((i) => !!i)
							.map((ingredient, index) => (
								<RecipeIngredientItem
									key={ingredient.get('id')}
									ingredient={ingredient}
									onDelete={() => {
										ingredients.delete(index);
									}}
								/>
							))}
					</div>
				</SortableContext>
			</DndContext>
			<EmbeddedRecipeIngredientsEditors recipe={recipe} />
			<AddIngredientsForm ingredients={ingredients} recipeId={id} />
		</div>
	);
}

function RecipeIngredientItem({
	ingredient,
	onDelete,
}: {
	ingredient: RecipeIngredientsItem;
	onDelete: () => void;
}) {
	const { setNodeRef, attributes, listeners, transform, transition } =
		useSortable({
			id: ingredient.get('id'),
		});

	const addNote = () => {
		ingredient.set('note', '');
	};

	if (transform) {
		// fixes the stretching effect as the item moves to different spots...
		transform.scaleY = 1;
		transform.scaleX = 1;
	}

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const { text, isSectionHeader } = hooks.useWatch(ingredient);

	return (
		<div
			ref={setNodeRef}
			className="flex flex-col gap-2 items-stretch p-2"
			{...attributes}
			style={style}
		>
			<div className="flex flex-row gap-2 items-start">
				<DragHandleDots2Icon
					className="touch-none relative top-2"
					{...listeners}
				/>

				<span
					className={classNames(
						'flex-1 min-w-40px mt-1',
						isSectionHeader && 'font-bold',
					)}
				>
					{text}
				</span>
				<div className="flex flex-row gap-1 items-center">
					<Button emphasis="ghost" onClick={addNote}>
						<Icon name="add_note" />
					</Button>
					<IngredientMenu ingredient={ingredient} onDelete={onDelete} />
				</div>
			</div>
			<IngredientNote ingredient={ingredient} />
		</div>
	);
}

function IngredientMenu({
	ingredient,
	onDelete,
}: {
	ingredient: RecipeIngredientsItem;
	onDelete: () => void;
}) {
	const { isSectionHeader } = hooks.useWatch(ingredient);
	const [detailsOpen, setDetailsOpen] = useState(false);

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button emphasis="ghost">
						<Icon name="dots" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuCheckboxItem
						checked={isSectionHeader}
						onCheckedChange={(v) => ingredient.set('isSectionHeader', !!v)}
					>
						<DropdownMenuItemIndicator>
							<CheckIcon />
						</DropdownMenuItemIndicator>
						Section header
					</DropdownMenuCheckboxItem>
					<DropdownMenuItem
						onSelect={(ev) => {
							setDetailsOpen(true);
						}}
					>
						Edit details
					</DropdownMenuItem>
					<DropdownMenuItem
						className="color-attention-dark"
						onSelect={onDelete}
					>
						<span>Delete</span>
						<DropdownMenuItemRightSlot>
							<Icon name="trash" />
						</DropdownMenuItemRightSlot>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<IngredientDetailsDialog
				ingredient={ingredient}
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
			/>
		</>
	);
}

function IngredientDetailsDialog({
	ingredient,
	...rest
}: {
	ingredient: RecipeIngredientsItem;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { isSectionHeader } = hooks.useWatch(ingredient);
	return (
		<Dialog {...rest}>
			<DialogContent>
				<FormikForm
					initialValues={{
						text: ingredient.get('text'),
						food: ingredient.get('food') || '',
						quantity: `${ingredient.get('quantity')}`,
						unit: ingredient.get('unit') || '',
					}}
					onSubmit={(values, bag) => {
						let quantity: number | undefined = parseFloat(values.quantity);
						if (isNaN(quantity)) {
							quantity = undefined;
						}
						ingredient.update({
							text: values.text,
							food: values.food?.toLocaleLowerCase() || undefined,
							quantity,
							unit: values.unit || undefined,
						});
						bag.setSubmitting(false);
						rest.onOpenChange?.(false);
					}}
				>
					<TextField name="text" label="Text" />
					{!isSectionHeader && <TextField name="food" label="Food" />}
					{!isSectionHeader && (
						<TextField name="quantity" label="Quantity" type="number" />
					)}
					{!isSectionHeader && <TextField name="unit" label="Unit" />}
					<DialogActions>
						<DialogClose asChild>
							<Button>Cancel</Button>
						</DialogClose>
						<SubmitButton emphasis="primary">Save</SubmitButton>
					</DialogActions>
				</FormikForm>
			</DialogContent>
		</Dialog>
	);
}

function IngredientNote({ ingredient }: { ingredient: RecipeIngredientsItem }) {
	const { note } = hooks.useWatch(ingredient);

	if (note === undefined || note === null) return null;

	return (
		<NoteEditor
			value={note}
			onChange={(value) => ingredient.set('note', value)}
			className="self-end"
		/>
	);
}

function AddIngredientsForm({
	ingredients,
	recipeId,
}: {
	ingredients: RecipeIngredients;
	recipeId: string;
}) {
	const [storedValue, setStoredValue] = useSessionStorage<string>(
		`recipe-${recipeId}-ingredients`,
		'',
		false,
	);

	const addIngredients = hooks.useAddRecipeIngredients();
	return (
		<FormikForm
			initialValues={{ text: storedValue || '' }}
			onSubmit={async ({ text }, bag) => {
				await addIngredients(ingredients, text);
				setStoredValue('');
				bag.resetForm({ values: { text: '' } });
			}}
			validate={({ text }) => {
				setStoredValue(text);
			}}
			validateOnBlur
		>
			{({ setFieldValue }) => (
				<>
					<TextAreaField
						name="text"
						required
						placeholder="Add ingredient line(s)"
						autoSize
						padBottomPixels={40}
					/>
					<div className="flex flex-row gap-1 justify-between items-center w-full">
						<SubmitButton>Add</SubmitButton>
					</div>
				</>
			)}
		</FormikForm>
	);
}

function EmbeddedRecipeIngredientsEditors({ recipe }: { recipe: Recipe }) {
	const embeddedIds = useSubRecipeIds(recipe);

	if (Object.keys(embeddedIds).length === 0) {
		return null;
	}

	return (
		<Box direction="col" p="none" gap="md">
			{Object.entries(embeddedIds).map(([id, mult]) => (
				<Suspense key={id}>
					<EmbeddedRecipeIngredientsEditor
						id={id}
						multiplier={mult}
						parent={recipe}
					/>
				</Suspense>
			))}
		</Box>
	);
}

function EmbeddedRecipeIngredientsEditor({
	id,
	multiplier,
	parent,
}: {
	id: string;
	multiplier: number;
	parent: Recipe;
}) {
	// just a simple display of title, mult, and edit button
	const recipe = hooks.useRecipe(id);

	const multText = ` (x${multiplier})`;

	return (
		<Box justify="between" items="center" p="none" gap="md">
			<span className="font-bold">
				Sub-recipe: {recipe?.get('title') ?? '<broken link>'}
				{multText}
			</span>
			<SubRecipeEditorButton parentRecipe={parent} subRecipeId={id} />
		</Box>
	);
}
