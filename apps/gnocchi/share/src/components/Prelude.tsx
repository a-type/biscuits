import {
	Peek,
	clsx,
	tipTapClassName,
	tipTapReadonlyClassName,
} from '@a-type/ui';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
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
				<EditorContent
					editor={editor}
					readOnly
					className={clsx(tipTapClassName, tipTapReadonlyClassName)}
				/>
			</div>
		</Peek>
	);
}
