import { Select } from '@a-type/ui';
import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';

export interface BlockSelectProps {
	editor: Editor;
	className?: string;
}

export function BlockSelect({ editor, className }: BlockSelectProps) {
	const currentNode = useEditorState({
		editor,
		selector: (state) => {
			let current = state.editor.state.selection.$head.parent;
			while ('parent' in current) {
				current = current.parent as any;
			}
			return current;
		},
	});

	const value = currentNode?.type.name || 'paragraph';

	return (
		<Select
			value={value}
			onValueChange={(selected) => {
				editor.chain().focus().setNode(selected).run();
			}}
		>
			<Select.Trigger size="small" className={className} />
			<Select.Content>
				<Select.Item
					value="paragraph"
					disabled={!editor.can().chain().focus().setNode('paragraph').run()}
				>
					Text
				</Select.Item>
				<Select.Item
					value="heading"
					disabled={
						!editor.can().chain().focus().setNode('heading', { level: 1 }).run()
					}
				>
					Heading
				</Select.Item>
				<Select.Item
					value="codeBlock"
					disabled={!editor.can().chain().focus().setNode('codeBlock').run()}
				>
					Code
				</Select.Item>
			</Select.Content>
		</Select>
	);
}
