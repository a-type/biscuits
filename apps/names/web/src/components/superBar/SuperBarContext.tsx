import { hooks, useAddPerson, useRecentPeople } from '@/hooks.js';
import {
	distance,
	LOCATION_BROAD_SEARCH_RADIUS,
	useGeolocation,
} from '@/services/location.js';
import { Person } from '@names.biscuits/verdant';
import { useNavigate } from '@verdant-web/react-router';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useDeferredValue,
	useMemo,
	useState,
} from 'react';

type ItemGroup = {
	title: string;
	items: Person[];
};

const SuperBarContext = createContext<{
	inputValue: string;
	setInputValue: (value: string) => void;
	groups: ItemGroup[];
	createNew: (options?: { attachLocation?: boolean }) => Promise<void>;
	loading: boolean;
	selectPerson: (person: Person) => void;
	setTagFilter: (updater: (prev: string[]) => string[]) => void;
	tagFilter: string[];
	loadMoreRecents?: () => void;
}>({
	inputValue: '',
	setInputValue: () => {},
	groups: [],
	createNew: async () => {},
	loading: false,
	selectPerson: () => {},
	setTagFilter: () => {},
	tagFilter: [],
	loadMoreRecents: undefined,
});

export const SuperBarProvider = ({ children }: { children: ReactNode }) => {
	const [inputValue, internalSetInputValue] = useState('');
	const deferredInput = useDeferredValue(inputValue);
	const deferredSearchWord = deferredInput.split(/\s+/)[0] ?? '';

	const [tagFilter, setTagFilter] = useState<string[]>([]);

	const [recentPeople, pageInfo] = useRecentPeople(tagFilter);
	const matchedPeopleByNameRaw = hooks.useAllPeople({
		index: {
			where: 'matchName',
			startsWith: deferredSearchWord.toLowerCase(),
		},
		key: 'matchedPeopleByName',
		skip: deferredSearchWord.length < 2,
	});
	const matchNameToInput = useCallback(
		(person: Person) =>
			person.get('name').toLowerCase().includes(deferredInput.toLowerCase()),
		[deferredInput],
	);
	const matchedPeopleByName = useMemo(
		() => matchedPeopleByNameRaw.filter(matchNameToInput),
		[matchedPeopleByNameRaw, matchNameToInput],
	);
	const matchedPeopleByNoteRaw = hooks.useAllPeople({
		index: {
			where: 'matchNote',
			startsWith: deferredSearchWord.toLowerCase(),
		},
		key: 'matchedPeopleByNote',
		skip: deferredSearchWord.length < 2,
	});
	const matchedPeopleByNote = useMemo(() => {
		return matchedPeopleByNoteRaw.filter((person) => {
			const note = person.get('note');
			if (!note) return false;
			return note.toLowerCase().includes(deferredInput.toLowerCase());
		});
	}, [matchedPeopleByNoteRaw, deferredInput]);
	const location = useGeolocation();
	const longitude = location?.longitude ?? 0;
	const matchedByLongitude = hooks.useAllPeople({
		index: {
			where: 'longitude',
			gte: longitude - LOCATION_BROAD_SEARCH_RADIUS,
			lte: longitude + LOCATION_BROAD_SEARCH_RADIUS,
		},
		key: 'matchedByLongitude',
		skip: !location,
	});
	const matchedByDistance = useMemo(
		() =>
			matchedByLongitude.filter(matchNameToInput).filter((person) => {
				if (!location) return false;
				const loc = person.get('geolocation');
				if (!loc) return false;
				const snap = loc.getSnapshot();
				if (!snap) return false;
				return distance(snap, location) < LOCATION_BROAD_SEARCH_RADIUS;
			}),
		[location, matchedByLongitude, matchNameToInput],
	);

	const isSearching = inputValue.length > 1;
	const groups = useMemo(() => {
		if (!isSearching) {
			return [
				{ title: 'Recent people', items: recentPeople },
				{
					title: 'Met nearby',
					items: matchedByDistance,
				},
			];
		}
		return [
			{ title: 'By name', items: matchedPeopleByName },
			{
				title: 'By note',
				items: matchedPeopleByNote,
			},
			{
				title: 'Met nearby',
				items: matchedByDistance,
			},
		];
	}, [
		isSearching,
		recentPeople,
		matchedPeopleByName,
		matchedPeopleByNote,
		matchedByDistance,
	]);

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const addPerson = useAddPerson();
	const createNew = useCallback(
		async (options: { attachLocation?: boolean } = {}) => {
			if (loading) return;
			try {
				setLoading(true);
				const person = await addPerson(inputValue, options);
				navigate(`/people/${person.get('id')}`);
				internalSetInputValue('');
			} finally {
				setLoading(false);
			}
		},
		[addPerson, navigate, inputValue, loading],
	);

	const selectPerson = useCallback(
		(person: Person) => {
			navigate(`/people/${person.get('id')}`, {
				skipTransition: true,
			});
			internalSetInputValue('');
		},
		[navigate],
	);

	return (
		<SuperBarContext.Provider
			value={{
				inputValue,
				setInputValue: internalSetInputValue,
				groups,
				createNew,
				loading,
				selectPerson,
				tagFilter,
				setTagFilter,
				loadMoreRecents: pageInfo.hasMore ? pageInfo.loadMore : undefined,
			}}
		>
			{children}
		</SuperBarContext.Provider>
	);
};

export function useSuperBar() {
	return useContext(SuperBarContext);
}

function isNewItem(
	item: Person | { id: 'new'; name: string },
): item is { readonly id: 'new'; readonly name: string } {
	return (item as any).id === 'new';
}
