import { hooks } from '@/stores/groceries/index.js';
import { useAddRecipeIngredients } from '@/stores/groceries/mutations.js';
import {
	Box,
	Button,
	Dialog,
	DropdownMenu,
	FormikForm,
	Icon,
	SubmitButton,
	Text,
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
		<Box border rounded p="sm">
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
					<Box col gap="sm">
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
					</Box>
				</SortableContext>
			</DndContext>
			<EmbeddedRecipeIngredientsEditors recipe={recipe} />
			<AddIngredientsForm ingredients={ingredients} recipeId={id} />
		</Box>
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
		// eslint-disable-next-line react-hooks/immutability
		transform.scaleY = 1;
		// eslint-disable-next-line react-hooks/immutability
		transform.scaleX = 1;
	}

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const { text, isSectionHeader } = hooks.useWatch(ingredient);

	return (
		<Box
			ref={setNodeRef}
			col
			items="stretch"
			gap="sm"
			p="sm"
			{...attributes}
			style={style}
		>
			<Box gap="sm" items="start">
				<Icon
					name="grabby"
					className="relative top-2 touch-none"
					{...listeners}
				/>

				<Text
					style={{
						marginTop: 4,
						minWidth: 40,
						flex: 1,
					}}
					bold={isSectionHeader}
				>
					{text}
				</Text>
				<Box items="center" gap="xs">
					<Button emphasis="ghost" onClick={addNote}>
						<Icon name="add_note" />
					</Button>
					<IngredientMenu ingredient={ingredient} onDelete={onDelete} />
				</Box>
			</Box>
			<IngredientNote ingredient={ingredient} />
		</Box>
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
				<DropdownMenu.Trigger render={<Button emphasis="ghost" />}>
					<Icon name="dots" />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.CheckboxItem
						checked={isSectionHeader}
						onCheckedChange={(v) => ingredient.set('isSectionHeader', !!v)}
					>
						<DropdownMenu.ItemIndicator>
							<Icon name="check" />
						</DropdownMenu.ItemIndicator>
						Section header
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.Item
						onClick={() => {
							setDetailsOpen(true);
						}}
					>
						Edit details
					</DropdownMenu.Item>
					<DropdownMenu.Item className="@mode-attention" onClick={onDelete}>
						<span>Delete</span>
						<DropdownMenu.ItemRightSlot>
							<Icon name="trash" />
						</DropdownMenu.ItemRightSlot>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
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
			<Dialog.Content>
				<Dialog.Title>Ingredient Details</Dialog.Title>
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
					<Dialog.Actions>
						<Dialog.Close>Cancel</Dialog.Close>
						<SubmitButton emphasis="primary">Save</SubmitButton>
					</Dialog.Actions>
				</FormikForm>
			</Dialog.Content>
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
			style={{ alignSelf: 'end' }}
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

	const addIngredients = useAddRecipeIngredients();
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
			{() => (
				<>
					<TextAreaField
						name="text"
						required
						placeholder="Add ingredient line(s)"
						autoSize
						padBottomPixels={40}
						textAreaClassName="w-full"
					/>
					<Box full="width" items="center" justify="between" gap="xs">
						<SubmitButton>Add</SubmitButton>
					</Box>
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
		<Box col p="none" gap="md">
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
			<Text bold>
				Sub-recipe: {recipe?.get('title') ?? '<broken link>'}
				{multText}
			</Text>
			<SubRecipeEditorButton parentRecipe={parent} subRecipeId={id} />
		</Box>
	);
}
