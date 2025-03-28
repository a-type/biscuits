import { hooks, useAddPerson, useRecentPeople } from '@/hooks.js';
import {
	distance,
	LOCATION_BROAD_SEARCH_RADIUS,
	useGeolocation,
} from '@/services/location.js';
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
					navigate(window.location.pathname, { replace: true });
				}
				return;
			}

			const search = new URLSearchParams(window.location.search);
			search.set('q', v);
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
			const person = await addPerson(inputValue);
			navigate(`/people/${person.get('id')}`);
		} finally {
			setLoading(false);
		}
	}, [addPerson, navigate, inputValue, loading]);

	const selectPerson = useCallback(
		(person: Person) => {
			navigate(`/people/${person.get('id')}`, {
				preserveQuery: true,
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
