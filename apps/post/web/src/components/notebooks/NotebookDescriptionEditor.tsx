import { Box, clsx, tipTapClassName } from '@a-type/ui';
import { tiptapExtensions } from '@post.biscuits/common';
import { Notebook } from '@post.biscuits/verdant';
import { EditorContent } from '@tiptap/react';
import { useSyncedEditor } from '@verdant-web/tiptap/react';

export interface NotebookDescriptionEditorProps {
	notebook: Notebook;
	className?: string;
}

export function NotebookDescriptionEditor({
	notebook,
	className,
}: NotebookDescriptionEditorProps) {
	const editor = useSyncedEditor(notebook, 'description', {
		editorOptions: {
			extensions: tiptapExtensions,
		},
	});
	return (
		<Box className={className}>
			<EditorContent
				editor={editor}
				className={clsx(
					tipTapClassName,
					'h-120px [&_.ProseMirror]:(h-full overflow-y-auto)',
				)}
			/>
		</Box>
	);
}
