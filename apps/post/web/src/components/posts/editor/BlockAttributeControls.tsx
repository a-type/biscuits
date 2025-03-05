import { Box, CollapsibleSimple, Select } from '@a-type/ui';
import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';

export interface BlockAttributeControlsProps {
	editor: Editor;
	className?: string;
}

export function BlockAttributeControls({
	editor,
	className,
}: BlockAttributeControlsProps) {
	const currentNode = useEditorState({
		editor,
		selector: (state) => state.editor.state.selection.$head.parent,
		equalityFn: (a, b) => {
			if (a !== b) return false;
			for (const [k, v] of Object.entries(a.attrs)) {
				if (b.attrs[k] !== v) return false;
			}
			return true;
		},
	});

	const nodeType = currentNode?.type.name ?? '';
	const config = attributeConfigs[nodeType] ?? [];

	const open = !!nodeType && config.length > 0;

	return (
		<CollapsibleSimple open={open} horizontal>
			<Box gap className={className}>
				{config.map(({ name, options, default: defaultValue }) => (
					<Select
						key={name}
						value={currentNode.attrs[name] || defaultValue}
						onValueChange={(value) => {
							editor
								.chain()
								.focus()
								.setNode(nodeType, { ...currentNode.attrs, [name]: value })
								.run();
						}}
					>
						<Select.Trigger size="small" />
						<Select.Content>
							{options.map(({ value, label }) => (
								<Select.Item
									key={value}
									value={value}
									disabled={
										!editor
											.can()
											.chain()
											.focus()
											.setNode(nodeType, {
												...currentNode.attrs,
												[name]: value,
											})
											.run()
									}
								>
									{label}
								</Select.Item>
							))}
						</Select.Content>
					</Select>
				))}
			</Box>
		</CollapsibleSimple>
	);
}

type AttributeConfig = {
	name: string;
	default: any;
	options: { value: any; label: string }[];
};

const attributeConfigs: Record<string, AttributeConfig[]> = {
	heading: [
		{
			name: 'level',
			default: 1,
			options: [
				{ value: 1, label: 'H1' },
				{ value: 2, label: 'H2' },
				{ value: 3, label: 'H3' },
				{ value: 4, label: 'H4' },
			],
		},
	],
};
