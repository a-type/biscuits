import {
	ActionBar,
	Box,
	Button,
	ButtonProps,
	clsx,
	Icon,
	LiveUpdateTextField,
	Popover,
	tipTapClassName,
	withClassName,
} from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';
import { Editor, posToDOMRect } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import {
	BubbleMenu,
	EditorContent,
	FloatingMenu,
	useEditorState,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { NodeIdExtension } from '@verdant-web/tiptap';
import { useSyncedEditor } from '@verdant-web/tiptap/react';
import { useCallback, useEffect } from 'react';
import { RedoAction } from '../actions/RedoAction.jsx';
import { UndoAction } from '../actions/UndoAction.jsx';

export interface PostEditorProps {
	post: Post;
	className?: string;
}

const IdExtension = NodeIdExtension();

export function PostEditor({ post, className }: PostEditorProps) {
	const editor = useSyncedEditor(post, 'body', {
		editorOptions: {
			extensions: [
				StarterKit.configure({
					history: false,
				}),
				IdExtension,
				Placeholder.configure({
					placeholder: 'Ah, the blank page...',
				}),
				Link.configure({
					autolink: true,
					openOnClick: 'whenNotEditable',
				}),
				Typography,
			],
		},
	});

	const getBlockMenuRect = useCallback(() => {
		if (!editor)
			return {
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: 0,
				height: 0,
				x: 0,
				y: 0,
				toJSON() {},
			};
		// get start of current line
		const { selection } = editor.state;
		const { from } = selection;
		const pos = editor.state.doc.resolve(from);

		return posToDOMRect(editor.view, pos.start(), pos.end());
	}, [editor]);

	useEffect(() => {
		(window as any).editor = editor;
	}, [editor]);

	return (
		<Box d="col" items="stretch" className={clsx('pl-[30px]', className)}>
			<ActionBar className="sticky top-0 bg-white z-menu">
				<UndoAction />
				<RedoAction />
			</ActionBar>
			{editor && (
				<BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
					<Box gap surface p="sm" border className="shadow-sm">
						<BoldToggle editor={editor} />
						<ItalicToggle editor={editor} />
						<LinkToggle editor={editor} />
					</Box>
				</BubbleMenu>
			)}
			{editor && (
				<BubbleMenu
					editor={editor}
					tippyOptions={{ duration: 100, placement: 'bottom' }}
					shouldShow={({ state, editor }) => {
						// only show when selection is highlighting a link node
						const { from, to } = state.selection;
						return editor.$doc.node.rangeHasMark(
							from,
							to,
							editor.schema.marks.link,
						);
					}}
				>
					<Box surface p="sm" border className="shadow-sm">
						<LinkEditor editor={editor} />
					</Box>
				</BubbleMenu>
			)}
			{editor && (
				<FloatingMenu
					editor={editor}
					tippyOptions={{
						duration: 100,
						placement: 'left-start',
						offset: [-6, 6],
						getReferenceClientRect: getBlockMenuRect,
					}}
					shouldShow={({ state }) => {
						return true;
						// const { selection } = state;
						// const { from } = selection;
						// const pos = state.doc.resolve(from);
						// return pos.start() === from;
					}}
				>
					<Box
						gap
						surface
						p="sm"
						d="col"
						items="end"
						className="opacity-70 hover:opacity-100 focus-within:opacity-100"
					>
						<Popover>
							<Popover.Trigger asChild>
								<Button size="icon-small" color="ghost">
									<Icon name="dots" />
								</Button>
							</Popover.Trigger>
							<Popover.Content align="start">
								<Popover.Arrow />
								<Box gap>
									<H1Toggle editor={editor} />
									<H2Toggle editor={editor} />
									<H3Toggle editor={editor} />
									<H4Toggle editor={editor} />
								</Box>
							</Popover.Content>
						</Popover>
					</Box>
				</FloatingMenu>
			)}
			<EditorContent
				editor={editor}
				className={clsx(
					tipTapClassName,
					'flex-1 flex flex-col [&_.ProseMirror]:(p-md flex-1 bg-transparent border-none shadow-none)',
					'[&_.tiptap_p.is-editor-empty:first-child::before]:(color-gray-5 content-[attr(data-placeholder)] h-0 float-left pointer-events-none)',
					'[&_.ProseMirror_a]:(underline color-primary-dark)',
					'[&_.ProseMirror_p]:(mb-lg leading-relaxed)',
				)}
			/>
		</Box>
	);
}

function LinkEditor({ editor }: { editor: Editor }) {
	const link = useEditorState({
		editor,
		selector: (state) =>
			state.editor?.state.selection.$head
				?.marks()
				?.find((mark) => mark.type.name === 'link'),
		equalityFn: (a, b) => a === b,
	});

	if (!link) return null;

	const removeLink = () => {
		editor.chain().unsetLink().run();
	};

	const updateLink = (v: string) => {
		editor.chain().setLink({ href: v }).run();
	};

	return (
		<Box gap items="center">
			<Button size="icon-small" color="ghost" onClick={removeLink}>
				<Icon name="x" />
			</Button>
			<LiveUpdateTextField value={link.attrs.href} onChange={updateLink} />
		</Box>
	);
}

const EditorToggle = withClassName(
	(props: ButtonProps) => (
		<Button
			color={props.toggled ? 'default' : 'ghost'}
			size="icon-small"
			toggleMode="state-only"
			{...props}
		/>
	),
	'w-24px h-24px items-center justify-center min-h-0 min-w-0',
);

function BoldToggle({ editor }: { editor: Editor }) {
	const toggled = editor.isActive('bold');
	return (
		<EditorToggle
			onClick={() => {
				editor.chain().focus().toggleMark('bold').run();
			}}
			disabled={!editor.can().chain().focus().toggleMark('bold').run()}
			toggled={toggled}
		>
			<span className="font-bold">B</span>
		</EditorToggle>
	);
}

function ItalicToggle({ editor }: { editor: Editor }) {
	const toggled = editor.isActive('italic');
	return (
		<EditorToggle
			onClick={() => {
				editor.chain().focus().toggleMark('italic').run();
			}}
			disabled={!editor.can().chain().focus().toggleMark('italic').run()}
			toggled={toggled}
		>
			<span className="italic">I</span>
		</EditorToggle>
	);
}

function H1Toggle({ editor }: { editor: Editor }) {
	const toggled = editor.isActive('heading', { level: 1 });
	return (
		<EditorToggle
			onClick={() => {
				editor
					.chain()
					.focus()
					.toggleNode('heading', 'paragraph', { level: 1 })
					.run();
			}}
			disabled={
				!editor
					.can()
					.chain()
					.focus()
					.toggleNode('heading', 'paragraph', { level: 1 })
					.run()
			}
			toggled={toggled}
		>
			H1
		</EditorToggle>
	);
}

function H2Toggle({ editor }: { editor: Editor }) {
	const toggled = editor.isActive('heading', { level: 2 });
	return (
		<EditorToggle
			onClick={() => {
				editor
					.chain()
					.focus()
					.toggleNode('heading', 'paragraph', { level: 2 })
					.run();
			}}
			disabled={
				!editor
					.can()
					.chain()
					.focus()
					.toggleNode('heading', 'paragraph', { level: 2 })
					.run()
			}
			toggled={toggled}
		>
			H2
		</EditorToggle>
	);
}

function H3Toggle({ editor }: { editor: Editor }) {
	const toggled = editor.isActive('heading', { level: 3 });
	return (
		<EditorToggle
			onClick={() => {
				editor
					.chain()
					.focus()
					.toggleNode('heading', 'paragraph', { level: 3 })
					.run();
			}}
			disabled={
				!editor
					.can()
					.chain()
					.focus()
					.toggleNode('heading', 'paragraph', { level: 3 })
					.run()
			}
			toggled={toggled}
		>
			H3
		</EditorToggle>
	);
}

function H4Toggle({ editor }: { editor: Editor }) {
	const toggled = editor.isActive('heading', { level: 4 });
	return (
		<EditorToggle
			onClick={() => {
				editor
					.chain()
					.focus()
					.toggleNode('heading', 'paragraph', { level: 4 })
					.run();
			}}
			disabled={
				!editor
					.can()
					.chain()
					.focus()
					.toggleNode('heading', 'paragraph', { level: 4 })
					.run()
			}
			toggled={toggled}
		>
			H4
		</EditorToggle>
	);
}

function LinkToggle({ editor }: { editor: Editor }) {
	const toggled = editor.isActive('link');
	return (
		<EditorToggle
			onClick={() => {
				editor.chain().focus().toggleMark('link').run();
			}}
			disabled={!editor.can().chain().focus().toggleMark('link').run()}
			toggled={toggled}
		>
			<Icon name="link" />
		</EditorToggle>
	);
}
