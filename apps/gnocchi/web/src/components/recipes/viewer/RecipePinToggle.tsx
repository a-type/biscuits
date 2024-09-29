import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@gnocchi.biscuits/verdant';
import addWeeks from 'date-fns/addWeeks';
import { useCallback } from 'react';
import { PinIcon } from '../collection/PinIcon.jsx';
import { Button } from '@a-type/ui/components/button';

export interface RecipePinToggleProps {
	recipe: Recipe;
}

const THREE_WEEKS_AGO = addWeeks(Date.now(), -3).getTime();

export function RecipePinToggle({ recipe }: RecipePinToggleProps) {
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
			size="icon"
			color={isPinned ? 'primary' : 'default'}
			onClick={togglePinned}
			className="relative"
		>
			<PinIcon isPinned={isPinned} />
		</Button>
	);
}
