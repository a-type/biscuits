import { hooks, useAddPerson, useRecentPeople } from '@/hooks.js';
import {
	distance,
	LOCATION_BROAD_SEARCH_RADIUS,
	useGeolocation,
} from '@/services/location.js';
import { Person } from '@names.biscuits/verdant';
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
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
	const search = useSearch({ strict: false }) as Record<string, string>;
	const inputValue = search.q ?? '';
	const routerLocation = useLocation();
	const navigate = useNavigate();
	const setInputValue = useCallback(
		(v: string) => {
			const currentPersonId = /\/people\/([^/]+)/.exec(
				routerLocation.pathname,
			)?.[1];
			if (v === '') {
				const prev = search.prev;
				if (prev) {
					navigate({ to: `/people/${prev}`, replace: true });
				} else {
					navigate({
						to: routerLocation.pathname,
						replace: true,
						search: (prevSearch) => ({
							...prevSearch,
							q: undefined,
							prev: undefined,
						}),
					});
				}
				return;
			}

			navigate({
				to: '/',
				replace: true,
				search: (prevSearch) => ({
					...prevSearch,
					q: v,
					prev: currentPersonId || undefined,
				}),
			});
		},
		[routerLocation.pathname, navigate, search.prev],
	);
	const deferredInput = useDeferredValue(inputValue);
	const deferredSearchWord = deferredInput.split(/\s+/)[0] ?? '';

	const [tagFilter, setTagFilter] = useState<string[]>([]);

	const [recentPeople, pageInfo] = useRecentPeople(tagFilter);
	const matchedPeople = hooks.useAllPeople({
		index: {
			where: 'matchText',
			startsWith: deferredSearchWord.toLowerCase(),
		},
		key: 'matchedPeople',
		skip: deferredSearchWord.length < 2,
	});
	const location = useGeolocation();
	const longitude = location?.longitude ?? 0;
	// don't suspend this as it may take a while to fetch location and we don't want
	// to trigger suspense after the initial page load.
	const { data: matchedByLongitude } = hooks.useAllPeopleUnsuspended({
		index: {
			where: 'longitude',
			gte: longitude - LOCATION_BROAD_SEARCH_RADIUS,
			lte: longitude + LOCATION_BROAD_SEARCH_RADIUS,
		},
		key: 'matchedByLongitude',
		skip: !location,
	});

	const isSearching = inputValue.length > 1;
	const groups = useMemo(() => {
		const matchedByDistance =
			location ?
				matchedByLongitude
					.filter((person) => matchesName(person, deferredInput))
					.filter((person) => matchesLocation(person, location))
			:	[];

		if (!isSearching) {
			return [
				{ title: 'Recent people', items: recentPeople },
				{
					title: 'Met nearby',
					items: matchedByDistance,
				},
			];
		}

		const matchedByName = matchedPeople.filter((person) =>
			matchesName(person, deferredInput),
		);
		const matchedByNote = matchedPeople.filter((person) =>
			matchesNote(person, deferredInput),
		);
		const matchedByLocation = matchedPeople.filter((person) =>
			matchesLocationLabel(person, deferredInput),
		);

		return [
			{ title: 'By name', items: matchedByName },
			{
				title: 'By note',
				items: matchedByNote,
			},
			{
				title: 'Met nearby',
				items: matchedByDistance,
			},
			{
				title: 'By place',
				items: matchedByLocation,
			},
		];
	}, [
		isSearching,
		recentPeople,
		location,
		matchedByLongitude,
		matchedPeople,
		deferredInput,
	]);

	const [loading, setLoading] = useState(false);
	const addPerson = useAddPerson();
	const [addRelationshipToCurrentPerson, setAddRelationshipToCurrentPerson] =
		useState(true);
	const previousPersonId = search.prev;
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
			const person = await addPerson(inputValue);
			navigate({ to: `/people/${person.get('id')}` });
		} finally {
			setLoading(false);
		}
	}, [addPerson, navigate, inputValue, loading]);

	const selectPerson = useCallback(
		(person: Person) => {
			navigate({
				to: `/people/${person.get('id')}`,
				search: (prevSearch) => prevSearch,
			});
			// delay clearing search so we don't have a flash
			// of unfiltered results
			setTimeout(() => {
				setInputValue('');
			}, 200);
		},
		[navigate, setInputValue],
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

function matchWords(haystack: string, needle: string) {
	return haystack.toLowerCase().includes(needle.toLowerCase());
}

function matchesName(person: Person, search: string) {
	return matchWords(person.get('name'), search);
}

function matchesNote(person: Person, search: string) {
	const note = person.get('note');
	if (!note) return false;
	return matchWords(note, search);
}

function matchesLocation(
	person: Person,
	location: { latitude: number; longitude: number },
) {
	const geolocation = person.get('geolocation');
	if (!geolocation) return false;
	const snap = geolocation.getSnapshot();
	if (!snap) return false;
	return distance(snap, location) < LOCATION_BROAD_SEARCH_RADIUS;
}

function matchesLocationLabel(person: Person, search: string) {
	const geolocation = person.get('geolocation');
	if (!geolocation) return false;
	const label = geolocation.get('label');
	if (!label) return false;
	return matchWords(label, search);
}

export function useSuperBar() {
	return useContext(SuperBarContext);
}
