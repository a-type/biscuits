import { useCategoryClaimPresence } from '@/components/groceries/categories/hooks.js';
import {
	PeopleList,
	PeopleListAvatar,
} from '@/components/sync/people/People.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button } from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
import { Category } from '@gnocchi.biscuits/verdant';
import { memo, useCallback, useEffect, useState } from 'react';

export const CategoryClaim = memo(function CategoryClaim({
	category,
}: {
	category: Category;
}) {
	const { isMyClaim, claimer } = useCategoryClaimPresence(category);
	const me = hooks.useSelf();
	const isSubscribed = useHasServerAccess();

	const claim = useCallback(() => {
		if (isMyClaim) {
			category.set('claim', null);
		} else {
			category.set('claim', {
				claimedBy: me.id,
				claimedAt: Date.now(),
			});
		}
	}, [me.id, isMyClaim, category]);

	const [showTooltip, setShowTooltip] = useState(false);
	useEffect(() => {
		if (claimer) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setShowTooltip(true);
		}
	}, [claimer]);
	useEffect(() => {
		if (showTooltip) {
			const timeout = setTimeout(() => {
				setShowTooltip(false);
			}, 2000);
			return () => {
				clearTimeout(timeout);
			};
		}
	}, [showTooltip]);

	const presences = hooks.useFindPeers(
		(peer) =>
			!!peer.presence?.lastInteractedCategory &&
			peer.presence?.lastInteractedCategory === category?.get('id'),
	);

	if (!isSubscribed) {
		return null;
	}

	const people = [...presences];
	if (claimer && !people.some((p) => p.id === claimer?.id)) {
		people.push(claimer);
	}

	const peopleCount = Math.max(1, people.length);

	return (
		<Button
			emphasis="ghost"
			size="small"
			className="h-auto w-auto p-0"
			onClick={claim}
		>
			<PeopleList count={peopleCount} size={20}>
				{people.map((person, index) => (
					<PeopleListAvatar
						key={person.id}
						index={index}
						person={person}
						popIn
					/>
				))}
				{!people.length && (
					<PeopleListAvatar
						index={0}
						person={null}
						popIn
						className="opacity-50"
					/>
				)}
			</PeopleList>
		</Button>
	);
});
