import { hooks } from '@/stores/groceries/index.js';
import { Button, clsx } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { addWeeks } from 'date-fns/addWeeks';
import { useCallback } from 'react';
import { PinIcon } from '../collection/PinIcon.jsx';

export interface RecipePinToggleProps {
	recipe: Recipe;
	className?: string;
}

const THREE_WEEKS_AGO = addWeeks(Date.now(), -3).getTime();

export function RecipePinToggle({ recipe, className }: RecipePinToggleProps) {
	const { pinnedAt } = hooks.useWatch(recipe);
	const isPinned = !!pinnedAt && pinnedAt > THREE_WEEKS_AGO;

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
			<PinIcon isPinned={isPinned} />
		</Button>
	);
}
