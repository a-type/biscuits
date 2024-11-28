'use client';

import { Peek, RichEditor } from '@a-type/ui';
// @ts-ignore
import { clsx } from '@a-type/ui';
import Link from '@tiptap/extension-link';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export interface PreludeProps {
	content: any;
}

export function Prelude({ content }: PreludeProps) {
	const editor = useEditor({
		extensions: [StarterKit.configure({}), Link],
		content,
		editable: false,
	});
	return (
		<Peek peekHeight={400}>
			<div className={clsx('p-summary', 'pb-4')} itemProp="description">
				<RichEditor editor={editor} readOnly />
			</div>
		</Peek>
	);
}
