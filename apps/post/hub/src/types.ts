export interface HubNotebookData {
	id: string;
	name: string;
	authorId: string;
	authorName: string;
	authorAvatarUrl: string | null;
	iconUrl: string | null;
	coverImageUrl: string | null;
	description: RichTextNode | null;
	createdAt: string;
	updatedAt: string | null;
	url: string;
}

export type HubNotebookSummaryData = Omit<
	HubNotebookData,
	'description' | 'authorId' | 'authorName' | 'authorAvatarUrl'
>;

export interface HubPostSummaryData {
	id: string;
	slug: string;
	title: string;
	coverImageUrl: string | null;
	createdAt: string;
	updatedAt: string | null;
	summary: string | null;
	authorId: string;
	authorName: string;
	authorAvatarUrl: string | null;
	url: string;
}

export interface HubPostData {
	id: string;
	title: string;
	coverImageUrl: string | null;
	createdAt: string;
	updatedAt: string | null;
	body: RichTextNode;
	authorId: string;
	authorName: string;
	authorAvatarUrl: string | null;
	url: string;
}

export interface RichTextNode {
	type: string;
	attrs?: Record<string, any> | null;
	content?: RichTextNode[] | null;
	marks?: RichTextNode[] | null;
	start?: number | null;
	end?: number | null;
	text?: string | null;
}
