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

export interface PublicRecipeData {
	id: string;
	title: string;
	prelude: {
		type: 'doc';
		content: RecipeParagraphNode[];
	};
	mainImageUrl?: string;
	ingredients: PublicRecipeIngredient[];
	// tiptap/prosemirror content
	instructions: {
		type: 'doc';
		content: (RecipeStepNode | RecipeSectionTitleNode)[];
	};
	publisher: {
		id: string;
		planId: string;
		fullName: string;
	};
	note?: string;
	servings?: number;
	prepTimeMinutes?: number;
	cookTimeMinutes?: number;
	totalTimeMinutes?: number;
}

export interface PublicRecipeIngredient {
	text: string;
	comments: string[];
	quantity: number;
	unit?: string;
	isSectionHeader: boolean;
	food: string;
	id: string;
	note: string | null;
}

export type RecipeParagraphNode = {
	type: 'paragraph';
	content: RecipeTextNode[];
};

export type RecipeTextNode = {
	type: 'text';
	text: string;
};

export type RecipeSectionTitleNode = {
	type: 'sectionTitle';
	content: RecipeTextNode[];
	attrs: {
		id: string;
		note?: string;
	};
};

export type RecipeStepNode = {
	type: 'step';
	content: RecipeTextNode[];
	attrs: {
		id: string;
		note?: string;
	};
};
