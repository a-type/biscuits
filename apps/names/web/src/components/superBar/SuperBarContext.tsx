import { hooks, useAddPerson, useRecentPeople } from '@/hooks.js';
import {
	distance,
	LOCATION_BROAD_SEARCH_RADIUS,
	useGeolocation,
} from '@/services/location.js';
import { useSessionStorage } from '@biscuits/client';
import { Person } from '@names.biscuits/verdant';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';
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
	addRelationshipToCurrentPerson: boolean;
	setAddRelationshipToCurrentPerson: (v: boolean) => void;
	relateTo: string[];
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
	addRelationshipToCurrentPerson: false,
	setAddRelationshipToCurrentPerson: () => {},
	relateTo: [],
});

export const SuperBarProvider = ({ children }: { children: ReactNode }) => {
	const [search] = useSearchParams();
	const inputValue = search.get('q') ?? '';
	const navigate = useNavigate();
	const setInputValue = useCallback(
		(v: string) => {
			const currentPersonId = /\/people\/([^/]+)/.exec(
				window.location.pathname,
			)?.[1];
			if (v === '') {
				const prev = new URLSearchParams(window.location.search).get('prev');
				if (prev) {
					navigate(`/people/${prev}`, { replace: true });
				} else {
					navigate('/', { replace: true });
				}
				return;
			}

			const search = new URLSearchParams(window.location.search);
			search.set('q', encodeURIComponent(v));
			if (currentPersonId) {
				search.set('prev', currentPersonId);
			}
			navigate(`/?${search.toString()}`, { replace: true });
		},
		[navigate],
	);
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

	const [loading, setLoading] = useState(false);
	const addPerson = useAddPerson();
	const [attachLocation] = useSessionStorage('attachLocation', true);
	const [addRelationshipToCurrentPerson, setAddRelationshipToCurrentPerson] =
		useState(true);
	const previousPersonId = search.get('prev');
	const relateTo = useMemo(() => {
		if (previousPersonId) {
			return [previousPersonId];
		}
		return [];
	}, [previousPersonId]);
	const createNew = useCallback(async () => {
		if (loading) return;
		try {
			setLoading(true);
			const person = await addPerson(inputValue, {
				attachLocation,
				relateTo: addRelationshipToCurrentPerson ? relateTo : undefined,
			});
			navigate(`/people/${person.get('id')}`);
		} finally {
			setLoading(false);
		}
	}, [
		addPerson,
		navigate,
		inputValue,
		loading,
		relateTo,
		addRelationshipToCurrentPerson,
	]);

	const selectPerson = useCallback(
		(person: Person) => {
			navigate(`/people/${person.get('id')}`, {
				skipTransition: true,
				preserveQuery: false,
			});
		},
		[navigate],
	);

	return (
		<SuperBarContext.Provider
			value={{
				inputValue,
				setInputValue,
				groups,
				createNew,
				loading,
				selectPerson,
				tagFilter,
				setTagFilter,
				loadMoreRecents: pageInfo.hasMore ? pageInfo.loadMore : undefined,
				addRelationshipToCurrentPerson,
				setAddRelationshipToCurrentPerson,
				relateTo,
			}}
		>
			{children}
		</SuperBarContext.Provider>
	);
};

export function useSuperBar() {
	return useContext(SuperBarContext);
}
