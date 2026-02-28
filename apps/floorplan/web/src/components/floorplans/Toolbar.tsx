import { Box, CollapsibleSimple, Icon, ToggleGroup } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';

export interface ToolbarProps {
	className?: string;
}

export function Toolbar(props: ToolbarProps) {
	const { tool, shapeType } = useSnapshot(editorState);

	return (
		<Box col {...props}>
			<CollapsibleSimple open={tool === 'shape'}>
				<ToggleGroup
					value={[shapeType]}
					onValueChange={([v]) => {
						editorState.shapeType = v as any;
					}}
					className="mb-sm"
				>
					<ToggleGroup.Item value="rectangle">
						<Icon name="cardsGrid" size={25} />
					</ToggleGroup.Item>
					<ToggleGroup.Item value="ellipse">
						<Icon name="info" size={25} />
					</ToggleGroup.Item>
				</ToggleGroup>
			</CollapsibleSimple>
			<ToggleGroup
				value={[tool]}
				onValueChange={([v]) => {
					editorState.tool = v as any;
				}}
			>
				<ToggleGroup.Item value="pan">
					<Icon name="hand" size={25} />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="select">
					<Icon name="boxSelect" size={25} />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="line">
					<Icon name="connection" size={25} />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="shape">
					<Icon name="fridge" size={25} />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="label">
					<Icon name="capitalization" size={25} />
				</ToggleGroup.Item>
			</ToggleGroup>
		</Box>
	);
}
