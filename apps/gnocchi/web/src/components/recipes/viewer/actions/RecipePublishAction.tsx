import { Link, TextLink } from '@/components/nav/Link.jsx';
import { withSuspense } from '@/hocs/withSuspense.jsx';
import { GnocchiClient, hooks } from '@/stores/groceries/index.js';
import {
	ActionButton,
	Box,
	Button,
	ButtonProps,
	Checkbox,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Icon,
	P,
	toast,
	Tooltip,
} from '@a-type/ui';
import { useFeatureFlag, useHasServerAccess } from '@biscuits/client';
import { graphql, useMutation, useQuery } from '@biscuits/graphql';
import type { PublicRecipe } from '@gnocchi.biscuits/share-schema';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { format } from 'date-fns';
import { useState } from 'react';
import { getSubRecipeIds } from '../../hooks.js';

export interface RecipePublishControlProps {
	recipe: Recipe;
}

const publishedQuery = graphql(`
	query RecipePublishData($recipeId: ID!) {
		publishedRecipe(id: $recipeId) {
			id
			publishedAt
			url
		}
	}
`);

const publishMutation = graphql(`
	mutation PublishRecipe($input: PublishRecipeInput!) {
		publishRecipe(input: $input) {
			id
			publishedAt
		}
	}
`);

const unpublishMutation = graphql(`
	mutation UnpublishRecipe($recipeId: ID!) {
		unpublishRecipe(recipeId: $recipeId)
	}
`);

export const RecipePublishAction = withSuspense(
	function RecipePublishControl({ recipe }: RecipePublishControlProps) {
		const enabled = useFeatureFlag('hub');
		const { data, loading, refetch } = useQuery(publishedQuery, {
			variables: { recipeId: recipe.get('id') },
		});

		const { url, updatedAt } = hooks.useWatch(recipe);
		const notAllowed = !!url;

		const canPublish = useHasServerAccess();

		if (!canPublish || !enabled) return null;

		if (loading || !data) {
			return <ActionButton disabled>Publish</ActionButton>;
		}

		if (notAllowed) {
			return (
				<Tooltip content="You can't publish web recipes, only your own.">
					<ActionButton disabled>Publish</ActionButton>
				</Tooltip>
			);
		}

		const publishedRecipe = data.publishedRecipe;
		const isPublished = !!publishedRecipe;

		const publishDate = publishedRecipe
			? new Date(publishedRecipe.publishedAt ?? Date.now())
			: new Date();
		const updatedDate = new Date(updatedAt);

		const outOfDate = updatedDate > publishDate;

		return (
			<Dialog>
				<DialogTrigger asChild>
					<ActionButton
						color="accent"
						emphasis={outOfDate ? 'light' : 'default'}
					>
						<Icon name={outOfDate ? 'clock' : 'send'} />
						{isPublished ? (outOfDate ? 'Outdated' : 'Shared') : 'Share'}
					</ActionButton>
				</DialogTrigger>
				{publishedRecipe ? (
					<PublishedContent
						recipe={recipe}
						publishedRecipe={publishedRecipe}
						onChange={refetch}
						outOfDate={outOfDate}
					/>
				) : (
					<UnpublishedContent recipe={recipe} onChange={refetch} />
				)}
			</Dialog>
		);
	},
	<ActionButton size="small" disabled>
		Publish
	</ActionButton>,
);

function PublishedContent({
	recipe,
	publishedRecipe: { publishedAt, url },
	onChange,
	outOfDate,
}: {
	recipe: Recipe;
	publishedRecipe: { publishedAt: string | null; url: string };
	onChange?: () => void;
	outOfDate?: boolean;
}) {
	const { id } = hooks.useWatch(recipe);
	const [unpublish] = useMutation(unpublishMutation, {
		onCompleted: onChange,
	});

	const publishDate = new Date(publishedAt ?? Date.now());

	return (
		<DialogContent className="flex flex-col gap-4">
			<DialogTitle>Manage publication</DialogTitle>
			<SubRecipeWarning recipe={recipe} />
			<Button asChild emphasis="default" className="self-start">
				<Link to={url} newTab>
					View on the web
					<Icon name="new_window" />
				</Link>
			</Button>
			{outOfDate ? (
				<Box surface gap col items="end" color="accent" p>
					This recipe has been updated since it was published on{' '}
					{format(publishDate, 'PPp')}. Click "Republish" to update the
					published version.
					<PublishButton recipe={recipe} onChange={onChange} emphasis="primary">
						Republish
					</PublishButton>
				</Box>
			) : (
				<Box surface="white" gap col items="end" p>
					This recipe was published on {format(publishDate, 'PPp')} and should
					be up to date. But you can still republish it if there's a problem.
					<PublishButton recipe={recipe} onChange={onChange} emphasis="ghost">
						Republish
					</PublishButton>
				</Box>
			)}
			<DialogActions>
				<DialogClose asChild>
					<Button>Close</Button>
				</DialogClose>
				<Button
					emphasis="primary"
					color="attention"
					onClick={async () => {
						try {
							await unpublish({
								variables: { recipeId: id },
							});
						} catch (err) {
							console.error(err);
							toast.error('Failed to unpublish recipe');
						}
					}}
				>
					Unpublish
				</Button>
			</DialogActions>
		</DialogContent>
	);
}

function UnpublishedContent({
	recipe,
	onChange,
}: {
	recipe: Recipe;
	onChange?: () => void;
}) {
	const [consent, setConsent] = useState(false);

	return (
		<DialogContent>
			<DialogTitle>Publish your recipe</DialogTitle>
			<div className="flex flex-col gap-4">
				<P>
					Published recipes can be shared with others on the web. You retain
					full rights to your recipe and can unpublish anytime
				</P>
				<div className="flex flex-row items-start gap-2">
					<Checkbox
						checked={consent}
						onCheckedChange={(c) => setConsent(c !== false)}
						id="publish-consent"
					/>
					<label htmlFor="publish-consent" className="text-xs">
						I confirm that I own and have the right to publish this recipe, in
						accordance with the{' '}
						<TextLink to="https://biscuits.club/tos" newTab>
							Biscuits Terms of Service
						</TextLink>
					</label>
				</div>
				<SubRecipeWarning recipe={recipe} />
			</div>
			<DialogActions>
				<DialogClose asChild>
					<Button>Cancel</Button>
				</DialogClose>
				<PublishButton
					recipe={recipe}
					onChange={onChange}
					emphasis="primary"
					disabled={!consent}
				>
					Publish
				</PublishButton>
			</DialogActions>
		</DialogContent>
	);
}

function SubRecipeWarning({ recipe }: { recipe: Recipe }) {
	const hasSubRecipes = recipe
		.get('instructions')
		.get('content')
		?.some((step: any) => !!step?.get('attrs')?.get('subRecipeId'));
	if (!hasSubRecipes) return null;

	return (
		<Box surface color="primary" p className="block">
			<strong>Warning:</strong> This recipe contains sub-recipes. They will be
			embedded in the published recipe.
		</Box>
	);
}

function PublishButton({
	recipe,
	onChange,
	children,
	...props
}: { recipe: Recipe; onChange?: () => void } & Omit<
	ButtonProps,
	'onChange' | 'onClick'
>) {
	const { id, slug } = hooks.useWatch(recipe);
	const [publish, { loading: publishing, called }] = useMutation(
		publishMutation,
		{
			onCompleted: onChange,
		},
	);
	const client = hooks.useClient();
	return (
		<Button
			color="accent"
			emphasis="default"
			{...props}
			onClick={async () => {
				try {
					await publish({
						variables: {
							input: {
								id,
								slug,
								data: await getPublicRecipeData(recipe, client),
							},
						},
					});
				} catch (err) {
					console.error(err);
					toast.error('Failed to publish recipe');
				}
			}}
			loading={publishing}
		>
			{children}
			{called && !publishing && <Icon name="check" />}
		</Button>
	);
}

async function getPublicRecipeData(
	recipe: Recipe,
	client: GnocchiClient,
	seen: Set<string> = new Set(),
): Promise<PublicRecipe> {
	const snapshot = recipe.getSnapshot();
	const subRecipeIds = getSubRecipeIds(recipe);
	const subRecipes = (
		await Promise.all(
			subRecipeIds
				.filter((id) => !seen.has(id))
				.map((subRecipeId) => client.recipes.get(subRecipeId).resolved),
		)
	).filter((r): r is Recipe => !!r);
	// avoid circular loops
	subRecipeIds.forEach((r) => seen.add(r));

	return {
		...snapshot,
		mainImageUrl: snapshot.mainImage?.url ?? undefined,
		subRecipes: await Promise.all(
			subRecipes.map((r) => getPublicRecipeData(r, client, seen)),
		),
	} satisfies PublicRecipe;
}
