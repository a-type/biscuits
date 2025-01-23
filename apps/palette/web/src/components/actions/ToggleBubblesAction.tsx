import { ActionButton, Icon } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { toolState } from '../projects/state.js';

export interface ToggleBubblesActionProps {}

export function ToggleBubblesAction({}: ToggleBubblesActionProps) {
	const showBubbles = useSnapshot(toolState).showBubbles;

	return (
		<ActionButton
			toggled={showBubbles}
			toggleMode="state-only"
			onClick={() => (toolState.showBubbles = !showBubbles)}
		>
			<Icon name={showBubbles ? 'eye' : 'eyeClosed'} />
			Dots
		</ActionButton>
	);
}
