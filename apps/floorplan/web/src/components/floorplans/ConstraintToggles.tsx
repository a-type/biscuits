import { Box, Button, Icon } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';

export interface ConstraintTogglesProps {
	className?: string;
}

export function ConstraintToggles(props: ConstraintTogglesProps) {
	const { angles, snapCorners } = useSnapshot(editorState).constraints;
	return (
		<Box gap p="xs" {...props}>
			<Button
				size="small"
				emphasis="ghost"
				toggled={angles}
				onClick={() => {
					editorState.constraints.angles = !angles;
				}}
			>
				<Icon name="angles" />
			</Button>
			<Button
				size="small"
				emphasis="ghost"
				toggled={snapCorners}
				onClick={() => {
					editorState.constraints.snapCorners = !snapCorners;
				}}
			>
				<Icon name="magnet" />
			</Button>
		</Box>
	);
}
