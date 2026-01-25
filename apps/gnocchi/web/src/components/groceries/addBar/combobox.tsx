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
	useDeferredValue,
	useState,
} from 'react';
import {
	destructureSearchPrompt,
	SuggestionGroup,
	suggestionToDisplayString,
	suggestionToString,
	useAddBarSuggestions,
	useKeepOpenAfterSelect,
	useParticlesOnAdd,
} from './hooks.js';

const BaseCombobox = Combobox.createGrouped<SuggestionGroup>();

const InternalContext = createContext<{
	placeholder?: string;
	add: (text: string) => void;
}>({
	add: () => {},
});

export function AddBarComboboxRoot({
	onOpenChange,
	...props
}: {
	className?: string;
	onOpenChange?: (v: boolean) => void;
	children?: ReactNode;
}) {
	const [query, setQuery] = useState('');
	const deferredQuery = useDeferredValue(query);
	const { groupedSuggestions, placeholder } = useAddBarSuggestions({
		showRichSuggestions: true,
		suggestionPrompt: deferredQuery,
	});
	const addItems = useAddItems();
	const onAdd = async (itemText: string) => {
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
			onOpenChange?.(false);
		}
	};
	const listId = useListId() || null;
	const [keepOpenOnSelect] = useKeepOpenAfterSelect();
	const [open, setOpen] = useState(false);

	const [addingRecipe, setAddingRecipe] = useState<Recipe | null>(null);
	const clearAddingRecipe = () => setAddingRecipe(null);

	return (
		<InternalContext.Provider
			value={{
				placeholder,
				add: onAdd,
			}}
		>
			<BaseCombobox
				open={open}
				// respect keep open on select setting
				onOpenChange={(isOpen, event) => {
					if (event.reason === 'item-press' && keepOpenOnSelect) return;
					setOpen(isOpen);
					onOpenChange?.(isOpen);
				}}
				inputValue={query}
				onInputValueChange={(v, ev) => {
					if (ev.reason === 'item-press') return;
					setQuery(v);
				}}
				items={groupedSuggestions}
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
							onOpenChange?.(false);
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
		</InternalContext.Provider>
	);
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
