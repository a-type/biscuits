import { RedoAction } from '@/components/groceries/actions/RedoAction.js';
import { UndoAction } from '@/components/groceries/actions/UndoAction.js';
import { ActionBar, ActionButton, Icon, IconName } from '@a-type/ui';
import { GridStyle, gridStyles, useGridStyle } from './hooks.js';

export function RecipeListActions() {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
			<GridStyleAction />
		</ActionBar>
	);
}

function GridStyleAction() {
	const [style, setStyle] = useGridStyle();
	const toggleGridStyle = () => {
		const idx = gridStyles.indexOf(style);
		const nextIdx = (idx + 1) % gridStyles.length;
		setStyle(gridStyles[nextIdx]);
	};
	return (
		<ActionButton onClick={toggleGridStyle}>
			<Icon name={gridStyleIcons[style]} />
			Card size
		</ActionButton>
	);
}

const gridStyleIcons: Record<GridStyle, IconName> = {
	'card-big': 'cardsRows',
	'card-small': 'cardsGrid',
};
