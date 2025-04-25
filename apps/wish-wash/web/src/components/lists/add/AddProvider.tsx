import { hooks } from '@/hooks.js';
import { useSearchParams } from '@verdant-web/react-router';
import {
	List,
	ListItemsItemInit,
	ListItemsItemType,
} from '@wish-wash.biscuits/verdant';
import {
	useCombobox,
	UseComboboxReturnValue,
	UseComboboxState,
	UseComboboxStateChangeOptions,
} from 'downshift';
import {
	createContext,
	startTransition,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';

const addItemContext = createContext<
	| (UseComboboxReturnValue<ListItemsItemType> & {
			options: ListItemsItemType[];
	  })
	| null
>(null);

export const AddItemProvider = ({
	children,
	list,
}: {
	children: React.ReactNode;
	list: List;
}) => {
	const { items } = hooks.useWatch(list);

	const [_, setSearch] = useSearchParams();

	const createItem = async (init: ListItemsItemInit) => {
		items.push(init);
		const item = items.get(items.length - 1);

		setSearch((s) => {
			s.set('itemId', item.get('id'));
			return s;
		});
	};

	const [suggestionPrompt, setSuggestionPrompt] = useState('');
	const suggestions = useMemo<ListItemsItemType[]>(() => {
		if (URL.canParse(suggestionPrompt)) {
			return ['link'];
		} else {
			return ['idea', 'vibe'];
		}
	}, [suggestionPrompt]);
	const realInputValueRef = useRef('');
	const combobox = useCombobox<ListItemsItemType>({
		onInputValueChange: ({ inputValue }) => {
			realInputValueRef.current = inputValue;
			startTransition(() => {
				setSuggestionPrompt(inputValue);
			});
		},
		initialHighlightedIndex: 0,
		defaultHighlightedIndex: 0,
		items: suggestions,
		itemToString: (item) => item || '',
		async onSelectedItemChange({ selectedItem, type }) {
			const inputValue = realInputValueRef.current;
			if (!inputValue) return;
			if (type === useCombobox.stateChangeTypes.InputBlur) {
				// don't select on blur
				return;
			}

			if (selectedItem === 'link') {
				createItem({
					type: 'link',
					links: [inputValue],
					description: 'Web link',
				});
			} else {
				createItem({
					type: selectedItem,
					description: inputValue,
				});
			}
		},
		stateReducer,
	});

	return (
		<addItemContext.Provider
			value={{
				...combobox,
				options: suggestions,
			}}
		>
			{children}
		</addItemContext.Provider>
	);
};

export const useAddItem = () => {
	const ctx = useContext(addItemContext);
	if (!ctx) {
		throw new Error('useAddItem must be used within an AddItemProvider');
	}
	return ctx;
};

function stateReducer(
	state: UseComboboxState<ListItemsItemType>,
	actionAndChanges: UseComboboxStateChangeOptions<ListItemsItemType>,
) {
	const { changes, type } = actionAndChanges;
	switch (type) {
		case useCombobox.stateChangeTypes.InputKeyDownEnter:
		case useCombobox.stateChangeTypes.ItemClick:
			return {
				...changes,
				inputValue: '',
			};
		case useCombobox.stateChangeTypes.InputBlur:
			return {
				...changes,
				inputValue: state.inputValue,
			};
		default:
			return changes;
	}
}
