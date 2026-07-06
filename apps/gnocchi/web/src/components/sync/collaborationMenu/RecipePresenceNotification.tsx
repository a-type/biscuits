import { Link } from '@/components/nav/Link.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { Person, hooks } from '@/stores/groceries/index.js';
import { Box, Button, Icon, Text } from '@a-type/ui';
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
		<Box
			full="width"
			items="center"
			gap="sm"
			overflow="hidden"
			border
			surface="ambient"
		>
			<Button onClick={onDismiss} emphasis="ghost" className="flex-0-0-auto">
				<Icon name="x" />
			</Button>
			<Box
				render={<Link to={makeRecipeLink(recipe)} onClick={onDismiss} />}
				grow
				items="center"
				gap="sm"
			>
				<PersonAvatar person={person} />
				<Box grow col gap="xs" style={{ minWidth: 0, flexBasis: 0 }}>
					<Text
						emphasis="ambient"
						dim
						style={{ marginLeft: -2 }}
						className="@mode-dense"
					>
						&nbsp;{person.profile.name} is viewing
					</Text>
					<Text truncate bold emphasis="primary">
						{recipe.get('title')}
					</Text>
				</Box>
				<Button
					size="small"
					role="none"
					tabIndex={-1}
					className="whitespace-nowrap"
					render={<div />}
				>
					Join
				</Button>
			</Box>
		</Box>
	);
}
