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
