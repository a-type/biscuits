export interface PublishPostPostInput {
	id: string;
	slug: string;
	title: string;
	coverImageId?: string | null;
	summary?: string | null;
	body: any;
}

export interface PublishPostNotebookInput {
	id: string;
	name: string;
	coverImageId?: string | null;
	iconId: string | null;
	description?: any;
}

export interface PublishPostInput {
	post: PublishPostPostInput;
	notebook: PublishPostNotebookInput;
}
