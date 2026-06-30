import { recipeSavePromptState } from '@/components/recipes/savePrompt/state.js';
import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { useAddItems } from '@/stores/groceries/mutations.js';
import { Combobox, Icon, toast, withClassName } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import {
	createContext,
	ReactNode,
	Suspense,
	useContext,
	useState,
} from 'react';
import cls from './combobox.module.css';
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
					modal={false}
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
			className={className}
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
			style={{ width: '100%', borderRadius: 9999 }}
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
			className={cls.createButton}
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
						<BaseCombobox.GroupLabel>{group.label}</BaseCombobox.GroupLabel>
						<BaseCombobox.GroupItemList>
							{group.items.map((item) => (
								<BaseCombobox.Item
									className="@mode-neutral"
									data-id={item.id}
									key={item.id}
									value={item}
								>
									{item.type === 'recipe' && <Icon name="page" />}
									<span>{suggestionToDisplayString(item).toLowerCase()}</span>
								</BaseCombobox.Item>
							))}
						</BaseCombobox.GroupItemList>
					</BaseCombobox.Group>
				)}
			</BaseCombobox.List>
			<BaseCombobox.Empty>No suggestions</BaseCombobox.Empty>
		</>
	);
}

export const AddBarComboboxContent = withClassName(
	BaseCombobox.Content,
	cls.content,
);
