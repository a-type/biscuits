import { hooks } from '@/hooks.js';
import { Box, clsx, tipTapClassName } from '@a-type/ui';
import { tiptapExtensions } from '@post.biscuits/common';
import { Post } from '@post.biscuits/verdant';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent } from '@tiptap/react';
import { useSyncedEditor } from '@verdant-web/tiptap/react';
import { useEffect } from 'react';
import { LinkMenu } from './editor/LinkMenu.jsx';
import { MainToolbar } from './editor/MainToolbar.jsx';

export interface PostEditorProps {
	post: Post;
	className?: string;
}

export function PostEditor({ post, className }: PostEditorProps) {
	const { files, notebookId } = hooks.useWatch(post);
	const notebook = hooks.useNotebook(notebookId!, { skip: !notebookId });
	const theme = notebook?.get('theme') ?? null;
	hooks.useWatch(theme);
	const spacingScale = theme?.get('spacing') || 'md';

	const editor = useSyncedEditor(post, 'body', {
		editorOptions: {
			extensions: [
				...tiptapExtensions,
				Placeholder.configure({
					placeholder: 'Ah, the blank page...',
				}),
			],
		},
		extensionOptions: {},
		files,
	});

	useEffect(() => {
		(window as any).editor = editor;
		(window as any).post = post;
	}, [editor, post]);

	const style = {
		'--global-spacing-scale':
			spacingScale === 'sm' ? '0.5'
			: spacingScale === 'lg' ? '2'
			: '1',
	} as any;

	return (
		<Box d="col" items="stretch" className={clsx(className)}>
			{editor && <LinkMenu editor={editor} />}
			{editor && <MainToolbar editor={editor} />}
			<EditorContent
				editor={editor}
				style={style}
				className={clsx(
					tipTapClassName,
					'flex-1 flex flex-col [&_.ProseMirror]:(p-8px flex-1 bg-transparent border-none shadow-none)',
					'[&_[data-verdant-file]]:(w-full flex flex-col)',
					'[&_img]:(max-w-full rounded-md h-auto max-h-60vh mx-auto)',
					'[&_video]:(max-w-full rounded-md h-auto max-h-60vh mx-auto)',
					'[&_audio]:(max-w-full h-auto)',
					'[&_.tiptap_p.is-editor-empty:first-child::before]:(color-gray content-[attr(data-placeholder)] h-0 float-left pointer-events-none)',
				)}
			/>
		</Box>
	);
}
