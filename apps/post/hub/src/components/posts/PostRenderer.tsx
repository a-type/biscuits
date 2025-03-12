import { HubPostData } from '@/types.js';
import { RichTextRenderer } from '../richText/RichTextRenderer.jsx';

export interface PostRendererProps {
	body: HubPostData['body'];
}

export function PostRenderer({ body }: PostRendererProps) {
	return <RichTextRenderer content={body} />;
}
