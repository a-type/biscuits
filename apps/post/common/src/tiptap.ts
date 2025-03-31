import Highlight from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Typography } from '@tiptap/extension-typography';
import { StarterKit } from '@tiptap/starter-kit';

export const tiptapExtensions = [
	StarterKit.configure({
		history: false,
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

export type RichContentWithNulls = {
	type: string;
	attrs?: Record<string, any> | null;
	content?: (RichContentWithNulls | null)[] | null;
	text?: string | null;
	marks?: (RichContentWithNulls | null)[] | null;
	start?: number | null;
	end?: number | null;
};

/**
 * Condenses rich text into plain text.
 */
export function tiptapToString(
	content: RichContentWithNulls,
	length?: number,
): string {
	const ctx = { length };
	const untrimmed = tiptapToStringRecursive(content, '', ctx);
	return length !== undefined && untrimmed.length > length ?
			untrimmed.substring(0, length) + '...'
		:	untrimmed;
}

function tiptapToStringRecursive(
	content: RichContentWithNulls,
	snippet: string,
	ctx: { length?: number },
) {
	if (ctx.length !== undefined && ctx.length <= 0) {
		return snippet;
	}
	content.content?.forEach((node) => {
		const text = node?.text;
		if (text) {
			snippet += text + ' ';
			if (ctx.length !== undefined) {
				ctx.length -= text.length + 1;
			}
		} else if (node?.content?.length) {
			snippet = tiptapToStringRecursive(node, snippet, ctx);
		}
	});
	return snippet;
}
