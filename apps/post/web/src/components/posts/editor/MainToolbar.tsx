import { RedoAction } from '@/components/actions/RedoAction.jsx';
import { UndoAction } from '@/components/actions/UndoAction.jsx';
import { clsx, HorizontalList } from '@a-type/ui';
import type { Editor } from '@tiptap/core';
import { useState } from 'react';
import { BlockAttributeControls } from './BlockAttributeControls.jsx';
import { BlockSelect } from './BlockSelect.jsx';
import {
	BoldToggle,
	HighlightToggle,
	ItalicToggle,
	LinkToggle,
} from './toggles.jsx';

export interface MainToolbarProps {
	editor: Editor;
	className?: string;
}

export function MainToolbar({ editor, className, ...props }: MainToolbarProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className={clsx('sticky top-1 z-menu', className)}>
			<HorizontalList
				open={open}
				onOpenChange={setOpen}
				contentClassName="items-center p-sm"
				{...props}
			>
				<UndoAction />
				<RedoAction />
				<BlockSelect editor={editor} className="justify-between min-w-120px" />
				<BlockAttributeControls editor={editor} />
				<BoldToggle editor={editor} />
				<ItalicToggle editor={editor} />
				<HighlightToggle editor={editor} />
				<LinkToggle editor={editor} />
			</HorizontalList>
		</div>
	);
}
