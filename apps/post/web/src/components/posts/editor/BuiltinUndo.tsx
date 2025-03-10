import { ActionButton, Icon } from '@a-type/ui';
import type { Editor } from '@tiptap/core';

export interface BuiltinUndoProps {
	editor: Editor;
}

export function BuiltinUndo({ editor }: BuiltinUndoProps) {
	return (
		<>
			<ActionButton
				size="small"
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().undo()}
			>
				<Icon name="undo" />
			</ActionButton>
			<ActionButton
				size="small"
				onClick={() => editor.chain().focus().redo().run()}
				visible={editor.can().redo()}
			>
				<Icon name="undo" className="rotate-180" />
			</ActionButton>
		</>
	);
}
