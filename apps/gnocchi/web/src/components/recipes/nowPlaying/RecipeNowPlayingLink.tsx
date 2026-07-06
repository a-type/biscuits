import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { hooks } from '@/stores/groceries/index.js';
import { clsx, ConfirmedButton, Icon, Text } from '@a-type/ui';
import { Recipe, RecipeInstructionsInit } from '@gnocchi.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { useKeepAliveSlugQuery } from '../hooks.js';
import cls from './RecipeNowPlayingLink.module.css';

export function RecipeNowPlayingLink({ recipe }: { recipe: Recipe }) {
	const { title, instructions, session, slug } = hooks.useWatch(recipe);

	// prewarm / keep alive slug query so that navigation
	// to recipe is faster.
	useKeepAliveSlugQuery(slug);

	const rawInstructions =
		instructions.getSnapshot() as unknown as RecipeInstructionsInit | null;
	const stepsLength =
		rawInstructions?.content?.filter((c) => c.type === 'step').length ?? 0;

	hooks.useWatch(session);
	const completedSteps = session?.get('completedInstructions').length ?? 0;

	const progress = stepsLength > 0 ? completedSteps / stepsLength : 0;

	const stopCooking = () => {
		recipe.set('session', null);
	};

	return (
		<div className={cls.root}>
			<Link to={makeRecipeLink(recipe, '')} className={cls.link}>
				<PieProgress value={progress} />
				<Text emphasis="secondary" bold truncate>
					{title}
				</Text>
			</Link>
			<ConfirmedButton
				confirmText="This will reset recipe progress"
				confirmTitle={`Stop cooking ${title}?`}
				confirmAction="Stop"
				cancelAction="Keep Cooking"
				onConfirm={stopCooking}
				emphasis="ghost"
				skip={progress === 1}
			>
				<Icon name="x" />
			</ConfirmedButton>
		</div>
	);
}

function PieProgress({ value }: { value: number }) {
	const circumference = 32 * Math.PI;
	return (
		<svg
			viewBox="0 0 32 32"
			className={clsx(cls.pieRoot, value >= 1 && '@mode-success')}
		>
			<circle
				r="50%"
				cx="50%"
				cy="50%"
				strokeDasharray="100"
				strokeDashoffset="100"
				className="fill-gray-light"
			/>
			<circle
				r="50%"
				cx="50%"
				cy="50%"
				fill="transparent"
				strokeDasharray={`${value * circumference} ${circumference}`}
				className={cls.pieProgress}
				opacity={0.7 + value * 0.3}
			/>
			{value >= 1 && (
				<>
					<circle r="50%" cx="50%" cy="50%" className="fill-accent" />
					<path
						d="M 12 16 L 16 20 L 22 12"
						fill="none"
						className={cls.pieCheck}
					/>
				</>
			)}
		</svg>
	);
}
