import z from 'zod/v4';

export const publicRecipeIngredientSchema = z.object({
	text: z.string(),
	comments: z.array(z.string()),
	quantity: z.number(),
	unit: z.string().nullable().default(null),
	isSectionHeader: z.boolean(),
	food: z.string().nullable().default(null),
	id: z.string(),
	note: z.string().nullable(),
});
export type PublicRecipeIngredient = z.infer<
	typeof publicRecipeIngredientSchema
>;

export const publicRecipeTextNodeSchema = z.object({
	type: z.string(),
	text: z.string().nullable(),
});

export const publicRecipeParagraphNodeSchema = z.object({
	type: z.string(),
	content: z.array(publicRecipeTextNodeSchema.nullable()).nullable(),
});

export const publicRecipeSectionTitleNodeSchema = z.object({
	type: z.string(),
	content: z.array(publicRecipeTextNodeSchema.nullable()).nullable(),
	attrs: z.looseObject({
		id: z.string().optional(),
		note: z.string().nullable().optional(),
	}),
});

export const publicRecipeStepNodeSchema = z.object({
	type: z.literal('step'),
	content: z.array(publicRecipeTextNodeSchema.nullable()).nullable(),
	attrs: z.looseObject({
		id: z.string().optional(),
	}),
});
export type PublicRecipeStepNode = z.infer<typeof publicRecipeStepNodeSchema>;

// TODO: embedded recipes
export const publicRecipeSchema = z.object({
	id: z.string(),
	title: z.string(),
	prelude: z
		.object({
			type: z.string(),
			content: z.array(publicRecipeParagraphNodeSchema.nullable()).nullable(),
		})
		.nullable(),
	mainImageUrl: z.url().optional(),
	ingredients: z.array(publicRecipeIngredientSchema),
	// tiptap/prosemirror content
	instructions: z.object({
		type: z.string(),
		content: z
			.array(
				z
					.union([
						publicRecipeStepNodeSchema,
						publicRecipeSectionTitleNodeSchema,
					])
					.nullable(),
			)
			.nullable(),
	}),
	note: z.string().nullable().optional(),
	servings: z.number().nullable().optional(),
	prepTimeMinutes: z.number().nullable().optional(),
	cookTimeMinutes: z.number().nullable().optional(),
	totalTimeMinutes: z.number().nullable().optional(),
	get subRecipes() {
		return z.array(publicRecipeSchema);
	},
});
export type PublicRecipe = z.infer<typeof publicRecipeSchema>;
