import { Button, ButtonProps, Icon, withClassName } from '@a-type/ui';
import { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';

const MarkToggle = withClassName(
	({
		editor,
		disabled,
		mark,
		toggled,
		...props
	}: ButtonProps & { editor: Editor; mark: string }) => {
		const selectionEmpty = useEditorState({
			editor,
			selector: ({ editor }) => editor.state.selection.empty,
		});
		const active = editor.isActive(mark);
		return (
			<Button
				color={toggled || active ? 'default' : 'ghost'}
				size="icon"
				toggleMode="state-only"
				disabled={
					disabled ||
					!editor.can().chain().focus().toggleMark(mark).run() ||
					selectionEmpty
				}
				onClick={() => {
					editor.chain().focus().toggleMark(mark).run();
				}}
				toggled={toggled || active}
				{...props}
			/>
		);
	},
	'aspect-1 items-center justify-center w-30px',
);

export function BoldToggle({ editor }: { editor: Editor }) {
	return (
		<MarkToggle editor={editor} mark="bold">
			<Icon name="bold" />
		</MarkToggle>
	);
}

export function ItalicToggle({ editor }: { editor: Editor }) {
	return (
		<MarkToggle editor={editor} mark="italic">
			<Icon name="italic" />
		</MarkToggle>
	);
}

export function HighlightToggle({ editor }: { editor: Editor }) {
	return (
		<MarkToggle editor={editor} mark="highlight">
			<Icon name="highlight" />
		</MarkToggle>
	);
}

export function LinkToggle({ editor }: { editor: Editor }) {
	return (
		<MarkToggle editor={editor} mark="link">
			<Icon name="link" />
		</MarkToggle>
	);
}
