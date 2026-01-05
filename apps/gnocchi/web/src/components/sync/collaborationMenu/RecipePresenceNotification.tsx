import { Link } from '@/components/nav/Link.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { Person, hooks } from '@/stores/groceries/index.js';
import { Button } from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
import { Cross2Icon } from '@radix-ui/react-icons';
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
		<div className="flex flex-row gap-2 items-center p-2 w-full max-w-full overflow-hidden border-default rounded-lg bg-white">
			<Button onClick={onDismiss} emphasis="ghost" className="flex-0-0-auto">
				<Cross2Icon />
			</Button>
			<Link
				to={makeRecipeLink(recipe)}
				onClick={onDismiss}
				className="flex flex-row gap-2 items-center flex-1"
			>
				<PersonAvatar person={person} />
				<div className="flex flex-col gap-2px flex-[1_1_0] min-w-0">
					<div className="text-xxs ml--2px">
						&nbsp;{person.profile.name} is viewing
					</div>
					<div className="text-xs font-bold overflow-hidden text-ellipsis whitespace-nowrap">
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
