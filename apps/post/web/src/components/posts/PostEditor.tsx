import { Box, clsx, tipTapClassName } from '@a-type/ui';
import { tiptapExtensions } from '@post.biscuits/common';
import { Post } from '@post.biscuits/verdant';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent } from '@tiptap/react';
import { NodeIdExtension } from '@verdant-web/tiptap';
import { useSyncedEditor } from '@verdant-web/tiptap/react';
import { useEffect } from 'react';
import { LinkMenu } from './editor/LinkMenu.jsx';
import { MainToolbar } from './editor/MainToolbar.jsx';

export interface PostEditorProps {
	post: Post;
	className?: string;
}

const IdExtension = NodeIdExtension();

export function PostEditor({ post, className }: PostEditorProps) {
	const editor = useSyncedEditor(post, 'body', {
		editorOptions: {
			extensions: [
				...tiptapExtensions,
				IdExtension,
				Placeholder.configure({
					placeholder: 'Ah, the blank page...',
				}),
			],
		},
	});

	useEffect(() => {
		(window as any).editor = editor;
	}, [editor]);

	return (
		<Box d="col" items="stretch" className={clsx(className)}>
			{editor && <LinkMenu editor={editor} />}
			{editor && <MainToolbar editor={editor} />}
			<EditorContent
				editor={editor}
				className={clsx(
					tipTapClassName,
					'flex-1 flex flex-col [&_.ProseMirror]:(p-md flex-1 bg-transparent border-none shadow-none)',
					'[&_.tiptap_p.is-editor-empty:first-child::before]:(color-gray content-[attr(data-placeholder)] h-0 float-left pointer-events-none)',
					'[&_.ProseMirror_a]:(underline color-primary-dark)',
					'[&_.ProseMirror_p]:(mb-lg leading-relaxed)',
				)}
			/>
		</Box>
	);
}
