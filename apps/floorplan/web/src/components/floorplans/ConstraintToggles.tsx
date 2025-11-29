import { Box, Button, Icon } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';

export interface ConstraintTogglesProps {
	className?: string;
}

export function ConstraintToggles(props: ConstraintTogglesProps) {
	const { angles, snapCorners } = useSnapshot(editorState).constraints;
	return (
		<Box gap {...props}>
			<Button size="small" toggled={angles}>
				<Icon name="placeholder" />
			</Button>
			<Button size="small" toggled={snapCorners}>
				<Icon name="placeholder" />
			</Button>
		</Box>
	);
}
