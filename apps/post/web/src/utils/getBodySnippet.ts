import { PostBody } from '@post.biscuits/verdant';

export function getBodySnippet(body: PostBody, length: number = 100) {
	let snippet = '';
	body.get('content').forEach((node: any) => {
		const text = node.get('text');
		if (text) {
			snippet += text + ' ';
		} else if (node.get('content')?.length) {
			snippet += getBodySnippet(node, length - snippet.length);
		}
	});
	return snippet.substring(0, length);
}
