import { Box, Button, Icon, LiveUpdateTextField } from '@a-type/ui';
import type { Editor } from '@tiptap/core';
import { BubbleMenu } from '@tiptap/react';
import { Link } from '@verdant-web/react-router';

export interface LinkMenuProps {
	editor: Editor;
}

export function LinkMenu({ editor }: LinkMenuProps) {
	const href = editor.getAttributes('link')?.href;

	const removeLink = () => {
		editor.chain().unsetLink().run();
	};

	const updateLink = (v: string) => {
		editor.chain().setLink({ href: v }).run();
	};
	return (
		<BubbleMenu
			editor={editor}
			tippyOptions={{ duration: 100, animateFill: true, placement: 'bottom' }}
			shouldShow={({ editor }) => editor.isActive('link')}
		>
			<Box surface p="sm" gap items="center" border className="shadow-sm">
				<Button size="icon-small" color="ghost" onClick={removeLink}>
					<Icon name="x" />
				</Button>
				<LiveUpdateTextField value={href} onChange={updateLink} />
				<Button asChild color="ghostAccent">
					<Link newTab to={href || '#'}>
						<Icon name="new_window" />
					</Link>
				</Button>
			</Box>
		</BubbleMenu>
	);
}
