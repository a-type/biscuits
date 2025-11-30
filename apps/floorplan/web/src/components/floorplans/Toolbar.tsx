import { Box, Icon, ToggleGroup } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';

export interface ToolbarProps {
	className?: string;
}

export function Toolbar(props: ToolbarProps) {
	const tool = useSnapshot(editorState).tool;
	return (
		<Box gap {...props}>
			<ToggleGroup
				type="single"
				value={tool}
				onValueChange={(v) => {
					editorState.tool = v as any;
				}}
			>
				<ToggleGroup.Item value="select">
					<Icon name="boxSelect" size={25} />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="line">
					<Icon name="connection" size={25} />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="pan">
					<Icon name="hand" size={25} />
				</ToggleGroup.Item>
			</ToggleGroup>
		</Box>
	);
}
