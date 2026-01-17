import { Link } from '@/components/nav/Link.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { Person, hooks } from '@/stores/groceries/index.js';
import { Button, Icon } from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
import { Suspense, useState } from 'react';
import { PersonAvatar } from '../people/PersonAvatar.jsx';

export interface RecipePresenceNotificationProps {}

export function RecipePresenceNotification({}: RecipePresenceNotificationProps) {
	const isSubscribed = useHasServerAccess();

	if (isSubscribed) {
		return (
			<Suspense>
				<RecipePresenceNotificationContent />
			</Suspense>
		);
	} else {
		return null;
	}
}

export function useRecipePresenceNotification() {
	const viewingRecipe = hooks.useFindPeer((peer) => {
		return !!peer?.presence?.viewingRecipeId;
	});

	return {
		peer: viewingRecipe,
		recipeId: viewingRecipe?.presence.viewingRecipeId,
	};
}

function RecipePresenceNotificationContent() {
	const [dismissedId, setDismissedId] = useState('');
	const { peer, recipeId } = useRecipePresenceNotification();

	if (peer && recipeId && recipeId !== dismissedId) {
		return (
			<RecipePresenceLink
				person={peer}
				recipeId={recipeId}
				onDismiss={() => setDismissedId(recipeId)}
			/>
		);
	} else {
		return null;
	}
}

function RecipePresenceLink({
	recipeId,
	person,
	onDismiss,
}: {
	recipeId: string;
	person: Person;
	onDismiss: () => void;
}) {
	const recipe = hooks.useRecipe(recipeId);

	if (!recipe) return null;

	return (
		<div className="max-w-full w-full flex flex-row items-center gap-2 overflow-hidden border-default rounded-lg p-2 bg-white">
			<Button onClick={onDismiss} emphasis="ghost" className="flex-0-0-auto">
				<Icon name="x" />
			</Button>
			<Link
				to={makeRecipeLink(recipe)}
				onClick={onDismiss}
				className="flex flex-1 flex-row items-center gap-2"
			>
				<PersonAvatar person={person} />
				<div className="min-w-0 flex flex-[1_1_0] flex-col gap-2px">
					<div className="ml--2px text-xxs">
						&nbsp;{person.profile.name} is viewing
					</div>
					<div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold">
						{recipe.get('title')}
					</div>
				</div>
				<Button size="small" className="whitespace-nowrap" render={<div />}>
					Join
				</Button>
			</Link>
		</div>
	);
}
