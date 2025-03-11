import { JSONContent } from '@tiptap/core';
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

type OptionalToNull<T> = T extends object ? {
	[P in keyof T]: MaybeNull<T[P]>;
} : T;
type MaybeNull<T> = T extends undefined ? OptionalToNull<T> | null : OptionalToNull<T>;

type RichContentWithNulls = OptionalToNull<JSONContent>;

/**
 * Condenses rich text into plain text.
 */
export function tiptapToString(content: RichContentWithNulls, length?: number): string {
	return tiptapToStringRecursive(content, '', length);
}

function tiptapToStringRecursive(
	content: RichContentWithNulls,
	snippet: string,
	remainingLength?: number,
) {
	if (remainingLength === 0) {
		return snippet;
	}
	content.content?.forEach((node) => {
		const text = node.text;
		if (text) {
			snippet += text + ' ';
		} else if (node.content?.length) {
			snippet +=
				' ' +
				tiptapToString(
					node,
					length !== undefined ? length - snippet.length : undefined,
				);
		}
	});
	return snippet.substring(0, length);
}
