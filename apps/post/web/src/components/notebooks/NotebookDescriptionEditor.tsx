import { clsx, tipTapClassName, tipTapReadonlyClassName } from '@a-type/ui';
import { tiptapExtensions } from '@post.biscuits/common';
import { Notebook } from '@post.biscuits/verdant';
import { EditorContent } from '@tiptap/react';
import { useSyncedEditor } from '@verdant-web/tiptap/react';
import { useState } from 'react';

export interface NotebookDescriptionEditorProps {
	notebook: Notebook;
	className?: string;
}

export function NotebookDescriptionEditor({
	notebook,
	className,
}: NotebookDescriptionEditorProps) {
	const [editing, setEditing] = useState(false);

	const editor = useSyncedEditor(notebook, 'description', {
		editorOptions: {
			extensions: tiptapExtensions,
		},
	});

	return (
		<EditorContent
			onFocus={() => setEditing(true)}
			onBlur={() => setEditing(false)}
			editor={editor}
			autoFocus={editing}
			className={clsx(
				tipTapClassName,
				!editing && tipTapReadonlyClassName,
				!editing && 'text-xs p-0 [&_.ProseMirror]:(p-0 rounded-0)',
				'max-h-120px [&_.ProseMirror]:(h-full overflow-y-auto)',
				className,
			)}
		/>
	);
}
