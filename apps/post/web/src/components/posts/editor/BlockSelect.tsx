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
		selector: (state) => state.editor.state.selection.$head.parent,
	});

	return (
		<Select
			value={currentNode?.type.name}
			onValueChange={(value) => {
				editor.chain().focus().setNode(value).run();
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
					value="blockquote"
					disabled={!editor.can().chain().focus().setNode('blockquote').run()}
				>
					Quote
				</Select.Item>
				<Select.Item
					value="codeBlock"
					disabled={!editor.can().chain().focus().setNode('codeBlock').run()}
				>
					Code
				</Select.Item>
				<Select.Item
					value="bulletList"
					disabled={!editor.can().chain().focus().setNode('bulletList').run()}
				>
					Bulleted List
				</Select.Item>
				<Select.Item
					value="orderedList"
					disabled={!editor.can().chain().focus().setNode('orderedList').run()}
				>
					Numbered List
				</Select.Item>
			</Select.Content>
		</Select>
	);
}
