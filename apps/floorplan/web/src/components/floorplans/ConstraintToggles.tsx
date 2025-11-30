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
			<Button
				size="small"
				toggled={angles}
				onClick={() => {
					editorState.constraints.angles = !angles;
				}}
			>
				<Icon name="placeholder" />
			</Button>
			<Button
				size="small"
				toggled={snapCorners}
				onClick={() => {
					editorState.constraints.snapCorners = !snapCorners;
				}}
			>
				<Icon name="placeholder" />
			</Button>
		</Box>
	);
}
