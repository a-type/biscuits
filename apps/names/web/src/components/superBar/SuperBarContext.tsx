import { hooks } from '@/hooks.js';
import { Person } from '@names.biscuits/verdant';
import { useNavigate } from '@verdant-web/react-router';
import { useCombobox } from 'downshift';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

type ItemGroup = {
	title: string;
	items: Person[];
};

const SuperBarContext = createContext<{
	inputValue: string;
	groups: ItemGroup[];
	highlightedId: string | null;
	getInputProps: ReturnType<typeof useCombobox>['getInputProps'];
	getMenuProps: ReturnType<typeof useCombobox>['getMenuProps'];
	getItemProps: ReturnType<typeof useCombobox>['getItemProps'];
	isOpen: boolean;
	createNew: () => Promise<void>;
}>({
	inputValue: '',
	groups: [],
	highlightedId: null,
	getInputProps: () => ({}) as any,
	getMenuProps: () => ({}) as any,
	getItemProps: () => ({}) as any,
	isOpen: false,
	createNew: async () => {},
});

export const SuperBarProvider = ({ children }: { children: ReactNode }) => {
	const [inputValue, internalSetInputValue] = useState('');

	const [recentPeople] = hooks.useAllPeoplePaginated({
		index: {
			where: 'createdAt',
			order: 'desc',
		},
		pageSize: 25,
	});
	const matchedPeopleByName = hooks.useAllPeople({
		index: {
			where: 'matchName',
			startsWith: inputValue.toLowerCase(),
		},
		skip: inputValue.length < 2,
	});
	const matchedPeopleByNote = hooks.useAllPeople({
		index: {
			where: 'matchNote',
			startsWith: inputValue.toLowerCase(),
		},
		skip: inputValue.length < 2,
	});

	const isSearching = inputValue.length > 1;
	const groups = useMemo(() => {
		if (!isSearching) {
			return [{ title: 'Recent people', items: recentPeople }];
		}
		return [
			{ title: 'By name', items: matchedPeopleByName },
			{
				title: 'By note',
				items: matchedPeopleByNote,
			},
		];
	}, [isSearching, recentPeople, matchedPeopleByName, matchedPeopleByNote]);

	const navigate = useNavigate();

	const items = groups.flatMap((group) => group.items);

	const {
		isOpen,
		getMenuProps,
		getItemProps,
		getInputProps,
		highlightedIndex,
		setInputValue,
	} = useCombobox({
		items,
		onInputValueChange: ({ inputValue }) => internalSetInputValue(inputValue),
		async onSelectedItemChange(changes) {
			navigate(`/people/${changes.selectedItem.get('id')}`);
		},
		itemToString: (item) => inputValue,
		itemToKey: (item) => item?.get('id'),
		defaultHighlightedIndex: 0,
	});

	const highlightedId = items[highlightedIndex]?.get('id') ?? null;

	const client = hooks.useClient();
	const createNew = useCallback(async () => {
		const person = await client.people.put({
			name: inputValue,
		});
		navigate(`/people/${person.get('id')}`);
		setInputValue('');
	}, [client, navigate, inputValue]);

	return (
		<SuperBarContext.Provider
			value={{
				inputValue,
				groups,
				highlightedId,
				getInputProps,
				getMenuProps,
				getItemProps,
				isOpen,
				createNew,
			}}
		>
			{children}
		</SuperBarContext.Provider>
	);
};

export function useSuperBar() {
	return useContext(SuperBarContext);
}
