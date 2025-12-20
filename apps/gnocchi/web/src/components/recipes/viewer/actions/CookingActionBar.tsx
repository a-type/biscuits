import { TextLink } from '@/components/nav/Link.jsx';
import { useActiveCookingSession } from '@/components/recipes/hooks.js';
import {
	PeopleList,
	PeopleListItem,
} from '@/components/sync/people/People.jsx';
import { PersonAvatar } from '@/components/sync/people/PersonAvatar.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	ActionBar,
	ActionButton,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	ErrorBoundary,
	Icon,
	Note,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@a-type/ui';
import {
	CONFIG,
	ManagePlanButton,
	PromoteSubscriptionButton,
	useHasServerAccess,
	useIsLoggedIn,
	useLocalStorage,
} from '@biscuits/client';
import { graphql, useQuery } from '@biscuits/graphql';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { RecipePinToggle } from '../RecipePinToggle.jsx';
import { RecipeViewerEditButton } from '../RecipeViewerEditButton.jsx';
import { RecipeCloneAction } from './RecipeCloneAction.jsx';
import { RecipePublishAction } from './RecipePublishAction.jsx';

export interface CookingActionBarProps {
	recipe: Recipe;
	className?: string;
}

export function CookingActionBar({ recipe, ...rest }: CookingActionBarProps) {
	return (
		<ActionBar {...rest}>
			<RecipePinToggle recipe={recipe} className="mr-2" />
			<CookingPeople recipeId={recipe.get('id')} />
			<AddChefsAction />
			<StopCookingAction recipe={recipe} />
			<NoteToggleAction recipe={recipe} />
			<RecipeViewerEditButton recipe={recipe} />
			<RecipePublishAction recipe={recipe} />
			<RecipeCloneAction recipe={recipe} />
		</ActionBar>
	);
}

function CookingPeople({ recipeId }: { recipeId: string }) {
	const self = hooks.useSelf();
	const peers = hooks.useFindPeers(
		(peer) => peer.presence.viewingRecipeId === recipeId,
	);

	const syncing = hooks.useSyncStatus();

	if (!syncing || peers.length === 0) {
		return null;
	}

	return (
		<ErrorBoundary>
			<PeopleList count={peers.length + 1}>
				<PeopleListItem index={0}>
					<PersonAvatar person={self} />
				</PeopleListItem>
				{peers.map((peer, index) => (
					<PeopleListItem index={index + 1} key={peer.id}>
						<PersonAvatar person={peer} />
					</PeopleListItem>
				))}
			</PeopleList>
		</ErrorBoundary>
	);
}

const planMembersQuery = graphql(`
	query PlanMembersForCookingActionBar {
		plan {
			members {
				id
			}
		}
	}
`);

function AddChefsAction() {
	const isLoggedIn = useIsLoggedIn();
	const { data: members } = useQuery(planMembersQuery, {
		skip: !isLoggedIn,
	});
	const isSubscribed = useHasServerAccess();
	const showTip =
		members && (!isLoggedIn || members?.plan?.members.length === 1);
	const [dismissed, setDismissed] = useLocalStorage('add-chefs-tip', false);

	const showSubscribe = !isLoggedIn || !isSubscribed;

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) setDismissed(true);
			}}
		>
			<DialogTrigger asChild>
				<ActionButton
					visible={showTip && !dismissed}
					emphasis="light"
					color="accent"
				>
					<Icon name="add_person" />
					<span className="hidden sm:display-inline">Invite chefs</span>
				</ActionButton>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Invite chefs</DialogTitle>
				{showSubscribe ? (
					<>
						<p>
							Subscribe to invite others to help you cook! Recipe progress is
							shared for all plan members in real-time. You can have as many
							people on your plan as you like.
						</p>
						<p>
							Plus, subscribers get a whole lot of other features, including
							device sync, grocery collaboration, and web recipe scanning.
						</p>
						<p>
							<TextLink newTab to={`${CONFIG.HOME_ORIGIN}/join`}>
								Learn more about subscription features.
							</TextLink>
						</p>
					</>
				) : (
					<p>
						Invite people to your plan to cook together! Recipe progress is
						shared for all plan members in real-time.
					</p>
				)}
				<DialogActions>
					<DialogClose asChild>
						<Button align="start">Dismiss</Button>
					</DialogClose>
					{showSubscribe ? (
						<PromoteSubscriptionButton className="">
							Subscribe now
						</PromoteSubscriptionButton>
					) : (
						<ManagePlanButton />
					)}
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

function StopCookingAction({ recipe }: { recipe: Recipe }) {
	const session = useActiveCookingSession(recipe);
	const stopCooking = () => {
		recipe.set('session', null);
	};

	return (
		<ActionButton visible={!!session} onClick={stopCooking}>
			<Icon name="x" />
			Stop cooking
		</ActionButton>
	);
}

function NoteToggleAction({ recipe }: { recipe: Recipe }) {
	const { note } = hooks.useWatch(recipe);

	if (!note) return null;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<ActionButton emphasis="primary">
					<Icon name="note" />
					<span className="hidden sm:display-inline">Add note</span>
				</ActionButton>
			</PopoverTrigger>
			<PopoverContent
				sideOffset={8}
				align="start"
				className="p-0 bg-transparent border-none rounded-0 max-w-2/3"
			>
				<Note className="w-full h-full">{note}</Note>
			</PopoverContent>
		</Popover>
	);
}
