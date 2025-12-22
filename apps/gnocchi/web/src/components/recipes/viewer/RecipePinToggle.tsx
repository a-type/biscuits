import { hooks } from '@/stores/groceries/index.js';
import { Button, clsx } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useCallback } from 'react';
import { PinIcon } from '../collection/PinIcon.jsx';
import { RECIPE_PINNED_CUTOFF } from '../constants.js';

export interface RecipePinToggleProps {
	recipe: Recipe;
	className?: string;
}

export function RecipePinToggle({ recipe, className }: RecipePinToggleProps) {
	const { pinnedAt } = hooks.useWatch(recipe);
	const isPinned = !!pinnedAt && pinnedAt > RECIPE_PINNED_CUTOFF;

	const togglePinned = useCallback(() => {
		if (isPinned) {
			recipe.set('pinnedAt', null);
		} else {
			recipe.set('pinnedAt', Date.now());
		}
	}, [recipe, isPinned]);

	return (
		<Button
			emphasis={isPinned ? 'primary' : 'default'}
			onClick={togglePinned}
			className={clsx('relative', className)}
		>
			<Button.Icon>
				<PinIcon isPinned={isPinned} />
			</Button.Icon>
		</Button>
	);
}
