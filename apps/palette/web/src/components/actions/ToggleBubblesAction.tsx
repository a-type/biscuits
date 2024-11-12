import { useSnapshot } from 'valtio';
import { toolState } from '../projects/state.js';
import { ActionButton } from '@a-type/ui/components/actions';
import { Icon } from '@a-type/ui/components/icon';

export interface ToggleBubblesActionProps {}

export function ToggleBubblesAction({}: ToggleBubblesActionProps) {
	const showBubbles = useSnapshot(toolState).showBubbles;

	return (
		<ActionButton
			icon={<Icon name={showBubbles ? 'eye' : 'eyeClosed'} />}
			toggled={showBubbles}
			toggleMode="state-only"
			onClick={() => (toolState.showBubbles = !showBubbles)}
		>
			Dots
		</ActionButton>
	);
}
