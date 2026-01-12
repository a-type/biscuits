import z from 'zod/v4';

export const publicWishlistItemSchema = z.object({
	id: z.string(),
	description: z.string(),
	count: z.number(),
	prioritized: z.boolean(),
	imageUrls: z.array(z.string().url()),
	links: z.array(z.string().url()),
	createdAt: z.number(),
	purchasedCount: z.number(),
	priceMin: z.string().nullable(),
	priceMax: z.string().nullable(),
	note: z.string().nullable(),
	type: z.enum(['link', 'idea', 'vibe']),
	remoteImageUrl: z.string().url().nullable().optional(),
	prompt: z.string().nullable().optional(),
});
export type PublicWishlistItem = z.infer<typeof publicWishlistItemSchema>;

export const publicWishlistSchema = z.object({
	id: z.string(),
	title: z.string(),
	items: publicWishlistItemSchema.array(),
	hidePurchases: z.boolean().optional(),
	coverImageUrl: z.string().url().nullable().optional(),
	description: z.string().nullable().optional(),
	createdAt: z.number(),
});
export type PublicWishlist = z.infer<typeof publicWishlistSchema>;
