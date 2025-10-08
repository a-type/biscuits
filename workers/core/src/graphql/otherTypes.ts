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
	theme?: PublishPostNotebookThemeInput | null;
}

export interface PublishPostNotebookThemeInput {
	primaryColor: string;
	fontStyle: string;
	spacing: string;
	corners?: string | null;
}

export interface PublishPostInput {
	post: PublishPostPostInput;
	notebook: PublishPostNotebookInput;
}

export interface PublicWishlistData {
	id: string;
	slug: string;
	title: string;
	items: PublicWishlistItem[];
	hidePurchases?: boolean;
	author: string;
	coverImageUrl?: string | null;
	description?: string | null;
	createdAt: number;
}

export interface PublicWishlistItem {
	id: string;
	description: string;
	count: number;
	prioritized: boolean;
	imageUrls: string[];
	links: string[];
	createdAt: number;
	purchasedCount: number;
	priceMin: string | null;
	priceMax: string | null;
	note: string | null;
	type: 'link' | 'idea' | 'vibe';
	remoteImageUrl?: string | null;
	prompt?: string | null;
}
