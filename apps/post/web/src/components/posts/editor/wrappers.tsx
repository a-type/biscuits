import { Button, Icon } from '@a-type/ui';
import { Editor } from '@tiptap/core';
import { ReactNode } from 'react';

function Wrapper({
	editor,
	type,
	children,
}: {
	editor: Editor;
	type: string;
	children: ReactNode;
}) {
	return (
		<Button
			size="icon"
			disabled={!editor.can().chain().focus().wrapIn(type).run()}
			onClick={() => {
				editor.chain().focus().wrapIn(type).run();
			}}
			color="ghost"
		>
			{children}
		</Button>
	);
}

export function WrapBlockquote({ editor }: { editor: Editor }) {
	return (
		<Wrapper editor={editor} type="blockquote">
			<Icon name="quote" />
		</Wrapper>
	);
}

export function WrapBulletList({ editor }: { editor: Editor }) {
	return (
		<Wrapper editor={editor} type="bulletList">
			<Icon name="bulletList" />
		</Wrapper>
	);
}

export function WrapOrderedList({ editor }: { editor: Editor }) {
	return (
		<Wrapper editor={editor} type="orderedList">
			<Icon name="orderedList" />
		</Wrapper>
	);
}
