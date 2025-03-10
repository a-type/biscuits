import Highlight from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Typography } from '@tiptap/extension-typography';
import { StarterKit } from '@tiptap/starter-kit';

export const tiptapExtensions = [
	StarterKit.configure({
		// history: false,
	}),
	Link.configure({
		autolink: true,
		openOnClick: 'whenNotEditable',
	}),
	Typography,
	Highlight.configure({
		multicolor: true,
	}),
];
