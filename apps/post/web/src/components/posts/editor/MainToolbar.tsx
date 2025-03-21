import { RedoAction } from '@/components/actions/RedoAction.jsx';
import { UndoAction } from '@/components/actions/UndoAction.jsx';
import { clsx, HorizontalList } from '@a-type/ui';
import type { Editor } from '@tiptap/core';
import { useState } from 'react';
import { BlockAttributeControls } from './BlockAttributeControls.jsx';
import { BlockSelect } from './BlockSelect.jsx';
import { InsertFile } from './InsertFile.jsx';
import {
	BoldToggle,
	HighlightToggle,
	ItalicToggle,
	LinkToggle,
} from './toggles.jsx';
import {
	WrapBlockquote,
	WrapBulletList,
	WrapOrderedList,
} from './wrappers.jsx';

export interface MainToolbarProps {
	editor: Editor;
	className?: string;
}

export function MainToolbar({ editor, className, ...props }: MainToolbarProps) {
	const [open, setOpen] = useState(false);

	return (
		<div
			className={clsx(
				'sticky top-[calc(var(--viewport-top-offset,0px)+0.125rem)] z-menu',
				className,
			)}
		>
			<HorizontalList
				open={open}
				onOpenChange={setOpen}
				contentClassName="items-center p-sm bg-white"
				{...props}
			>
				<UndoAction />
				<RedoAction />
				{/* <BuiltinUndo editor={editor} /> */}
				<BlockSelect editor={editor} className="justify-between min-w-120px" />
				<BlockAttributeControls editor={editor} />
				<BoldToggle editor={editor} />
				<ItalicToggle editor={editor} />
				<HighlightToggle editor={editor} />
				<LinkToggle editor={editor} />
				<WrapBlockquote editor={editor} />
				<WrapBulletList editor={editor} />
				<WrapOrderedList editor={editor} />
				<InsertFile editor={editor} />
			</HorizontalList>
		</div>
	);
}
