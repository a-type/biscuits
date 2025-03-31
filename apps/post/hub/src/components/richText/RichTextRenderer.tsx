import { RichTextNode } from '@/types.js';
import { clsx, tipTapClassName, tipTapReadonlyClassName } from '@a-type/ui';
import { tiptapExtensions } from '@post.biscuits/common';
import { generateHTML } from '@tiptap/html';
import { VerdantMediaRendererExtension } from '@verdant-web/tiptap/server';

export interface RichTextRendererProps {
	content: RichTextNode;
}

/**
 * Recursively removes null values from an object snapshot. This can
 * be used to delete empty subfields from a document field to conform
 * to TipTap's schema.
 */
function removeNulls<TObject extends object>(
	obj: TObject,
): WithoutNulls<TObject> {
	const newObj = {} as any;
	if (Array.isArray(obj)) {
		return obj.map((item) => removeNulls(item)) as any;
	}
	for (const key in obj) {
		if (obj[key] !== null) {
			if (typeof obj[key] === 'object') {
				newObj[key] = removeNulls(obj[key]);
			} else {
				newObj[key] = obj[key];
			}
		}
	}
	return newObj;
}
type WithoutNulls<TObject> =
	TObject extends object ?
		{
			[P in keyof TObject]: WithoutNulls<TObject[P]>;
		}
	: TObject extends null ? Exclude<TObject, null> | undefined
	: TObject;

export function RichTextRenderer({ content }: RichTextRendererProps) {
	const html = generateHTML(removeNulls(content), [
		...tiptapExtensions,
		VerdantMediaRendererExtension.configure({}),
	]);
	return (
		<div
			className={clsx(
				tipTapClassName,
				tipTapReadonlyClassName,
				'[&_[data-verdant-file]]:(w-full flex flex-col)',
				'[&_img]:(max-w-full rounded-md h-auto max-h-60vh mx-auto)',
				'[&_video]:(max-w-full rounded-md h-auto max-h-60vh mx-auto)',
				'[&_audio]:(max-w-full h-auto)',
			)}
		>
			<div dangerouslySetInnerHTML={{ __html: html }} className="ProseMirror" />
		</div>
	);
}
