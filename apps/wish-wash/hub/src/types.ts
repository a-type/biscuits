export interface HubWishlistData {
	id: string;
	slug: string;
	title: string;
	items: HubWishlistItem[];
	hidePurchases: boolean;
	author: string;
}

export interface HubWishlistItem {
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
	type: 'product' | 'idea' | 'vibe';
}
