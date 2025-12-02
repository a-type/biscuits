import { Box, CollapsibleSimple, Icon, ToggleGroup } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';

export interface ToolbarProps {
	className?: string;
}

export function Toolbar(props: ToolbarProps) {
	const { tool, activeAttachment } = useSnapshot(editorState);

	return (
		<Box col {...props}>
			<CollapsibleSimple open={tool === 'attachments'}>
				<ToggleGroup
					type="single"
					value={activeAttachment}
					onValueChange={(v) => {
						editorState.activeAttachment = v as any;
					}}
					className="mb-sm"
				>
					<ToggleGroup.Item value="door">
						<Icon name="fridge" size={25} />
					</ToggleGroup.Item>
					<ToggleGroup.Item value="window">
						<Icon name="cardsGrid" size={25} />
					</ToggleGroup.Item>
				</ToggleGroup>
			</CollapsibleSimple>
			<ToggleGroup
				type="single"
				value={tool}
				onValueChange={(v) => {
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
				<ToggleGroup.Item value="attachments">
					<Icon name="fridge" size={25} />
				</ToggleGroup.Item>
			</ToggleGroup>
		</Box>
	);
}
