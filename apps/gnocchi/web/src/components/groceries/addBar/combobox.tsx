import { recipeSavePromptState } from '@/components/recipes/savePrompt/state.js';
import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { useAddItems } from '@/stores/groceries/mutations.js';
import { clsx, Combobox, Icon, toast, withClassName } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import {
	createContext,
	ReactNode,
	Suspense,
	useContext,
	useState,
} from 'react';
import {
	destructureSearchPrompt,
	SuggestionGroup,
	suggestionToDisplayString,
	suggestionToString,
	useKeepOpenAfterSelect,
	useParticlesOnAdd,
} from './hooks.js';
import { useAddBarSuggestions } from './SuggestionContext.jsx';

const BaseCombobox = Combobox.createGrouped<SuggestionGroup>();

const InternalContext = createContext<{
	placeholder?: string;
	add: (text: string) => void;
}>({
	add: () => {},
});

const OpenContext = createContext<[boolean, (open: boolean) => void]>([
	false,
	() => {},
]);

export function AddBarComboboxRoot({
	onOpenChange,
	...props
}: {
	className?: string;
	children?: ReactNode;
	onOpenChange?: (open: boolean) => void;
}) {
	const openState = useState(false);
	const [open, setOpenInternal] = openState;

	const setOpen = (isOpen: boolean) => {
		setOpenInternal(isOpen);
		onOpenChange?.(isOpen);
	};

	const {
		suggestionPrompt: query,
		setSuggestionPrompt: setQuery,
		groupedSuggestions,
		placeholder,
	} = useAddBarSuggestions();
	const addItems = useAddItems();
	const onAdd = async (itemText: string) => {
		setQuery('');
		await addItems(
			itemText
				.split(/\n/)
				.map((l) => l.trim())
				.filter((l) => l),
			{
				listId,
			},
		);
		if (!keepOpenOnSelect) {
			setOpen(false);
		}
	};
	const listId = useListId() || null;
	const [keepOpenOnSelect] = useKeepOpenAfterSelect();

	const [addingRecipe, setAddingRecipe] = useState<Recipe | null>(null);
	const clearAddingRecipe = () => setAddingRecipe(null);

	return (
		<InternalContext.Provider
			value={{
				placeholder,
				add: onAdd,
			}}
		>
			<OpenContext.Provider value={openState}>
				<BaseCombobox
					open={open}
					// respect keep open on select setting
					onOpenChange={(isOpen, event) => {
						if (event.reason === 'item-press' && keepOpenOnSelect) return;
						setOpen(isOpen);
					}}
					inputValue={query}
					onInputValueChange={(v, ev) => {
						if (ev.reason === 'item-press') return;
						setQuery(v);
					}}
					filteredItems={groupedSuggestions}
					itemToStringValue={suggestionToString}
					itemToStringLabel={suggestionToDisplayString}
					value={null}
					onValueChange={async (item) => {
						setQuery('');
						if (!item) return;
						if (item.type === 'food') {
							const { quantity } = destructureSearchPrompt(query || '');
							if (quantity) {
								await onAdd(`${quantity} ${item.name}`);
							} else {
								await onAdd(item.name);
							}
						} else if (item.type === 'recipe') {
							setAddingRecipe(item.recipe);
							if (!keepOpenOnSelect) {
								setOpen(false);
							}
						} else {
							await onAdd(suggestionToString(item));
						}
					}}
					onCreate={async (text) => {
						setQuery('');
						if (URL.canParse(text)) {
							recipeSavePromptState.url = text;
						} else {
							await onAdd(text);
						}
					}}
					{...props}
				/>
				{addingRecipe && (
					<Suspense>
						<AddToListDialog
							recipe={addingRecipe}
							onOpenChange={clearAddingRecipe}
							open
						/>
					</Suspense>
				)}
			</OpenContext.Provider>
		</InternalContext.Provider>
	);
}

export function useIsAddBarOpen() {
	return useContext(OpenContext);
}

export function AddBarComboboxInput({
	className,
	...props
}: {
	className?: string;
}) {
	const { placeholder, add } = useContext(InternalContext);
	return (
		<BaseCombobox.Input
			{...props}
			disableCaret
			className={clsx('w-full border-black', className)}
			placeholder={placeholder}
			onPaste={(event) => {
				const paste = event.clipboardData.getData('text');
				const lines = paste
					.split(/\r?\n/)
					.map((l) => l.trim())
					.filter((l) => l);
				if (lines.length <= 1) return;
				event.preventDefault();
				add(lines.join('\n'));
				toast.success(`Added ${lines.length} items`);
			}}
		>
			<CreateButton />
		</BaseCombobox.Input>
	);
}

function CreateButton() {
	const [keepOpenOnSelect] = useKeepOpenAfterSelect();
	const ref = useParticlesOnAdd(keepOpenOnSelect);
	return (
		<BaseCombobox.CreateButton
			size="small"
			emphasis="primary"
			ref={ref}
			data-test="grocery-list-add-button"
			className="relative z-2 aspect-1 h-34px items-center justify-center rounded-md -my-1px md:rounded-full"
			aria-label="add to list"
		>
			<Icon name="plus" />
		</BaseCombobox.CreateButton>
	);
}

export function AddBarComboboxItems(props: { className?: string }) {
	return (
		<>
			<BaseCombobox.List {...props}>
				{(group) => (
					<BaseCombobox.Group key={group.id} items={group.items}>
						<BaseCombobox.GroupLabel className="color-gray-dark color-darken-2">
							{group.label}
						</BaseCombobox.GroupLabel>
						<BaseCombobox.GroupItemList className="gap-sm">
							{group.items.map((item) => (
								<BaseCombobox.Item data-id={item.id} key={item.id} value={item}>
									{item.type === 'recipe' && <Icon name="page" />}
									<span className="flex-1 overflow-hidden text-ellipsis text-sm">
										{suggestionToDisplayString(item).toLowerCase()}
									</span>
								</BaseCombobox.Item>
							))}
						</BaseCombobox.GroupItemList>
					</BaseCombobox.Group>
				)}
			</BaseCombobox.List>
			<BaseCombobox.Empty className="text-gray-dark italic">
				No suggestions
			</BaseCombobox.Empty>
		</>
	);
}

export const AddBarComboboxContent = withClassName(
	BaseCombobox.Content,
	'p-sm',
);
