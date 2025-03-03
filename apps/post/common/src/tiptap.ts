import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Typography } from '@tiptap/extension-typography';

export const tiptapExtensions = [
	StarterKit.configure({
		history: false,
	}),
	Link.configure({
		autolink: true,
		openOnClick: 'whenNotEditable',
	}),
	Typography,
];
