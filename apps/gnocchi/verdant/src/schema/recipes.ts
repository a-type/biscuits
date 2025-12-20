import { schema } from '@verdant-web/common';
import { createTipTapFieldSchema } from '@verdant-web/tiptap';
import cuid from 'cuid';
import { fullTextIndex } from '../fullTextIndex.js';

export const recipes = schema.collection({
	name: 'recipe',
	primaryKey: 'id',
	fields: {
		id: schema.fields.string({
			default: () => cuid(),
		}),
		slug: schema.fields.string({
			default: () => cuid.slug(),
		}),
		multiplier: schema.fields.number({
			default: 1,
		}),
		title: schema.fields.string({
			default: 'New Recipe',
		}),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		updatedAt: schema.fields.number({
			default: () => Date.now(),
		}),
		prepTimeMinutes: schema.fields.number({
			nullable: true,
		}),
		cookTimeMinutes: schema.fields.number({
			nullable: true,
		}),
		totalTimeMinutes: schema.fields.number({
			nullable: true,
		}),
		servings: schema.fields.number({
			nullable: true,
		}),
		prelude: createTipTapFieldSchema({
			default: {
				type: 'doc',
				content: [],
			},
		}),
		note: schema.fields.string({
			nullable: true,
		}),
		ingredients: schema.fields.array({
			items: schema.fields.object({
				properties: {
					id: schema.fields.string({
						default: () => cuid(),
					}),
					text: schema.fields.string(),
					unit: schema.fields.string({
						nullable: true,
					}),
					food: schema.fields.string({
						nullable: true,
					}),
					quantity: schema.fields.number({
						default: 1,
					}),
					comments: schema.fields.array({
						items: schema.fields.string(),
					}),
					note: schema.fields.string({
						nullable: true,
					}),
					isSectionHeader: schema.fields.boolean({
						default: false,
					}),
				},
			}),
		}),
		instructions: createTipTapFieldSchema({
			default: {
				type: 'doc',
				content: [],
			},
		}),
		url: schema.fields.string({
			nullable: true,
		}),
		session: schema.fields.object({
			nullable: true,
			properties: {
				startedAt: schema.fields.number({
					default: () => Date.now(),
				}),
				completedInstructions: schema.fields.array({
					items: schema.fields.string(),
				}),
				completedIngredients: schema.fields.array({
					items: schema.fields.string(),
				}),
				instructionAssignments: schema.fields.map({
					values: schema.fields.string(),
				}),
				ingredientAssignments: schema.fields.map({
					values: schema.fields.string(),
				}),
			},
		}),
		/**
		 * String literal tags. Recipes can be filtered by tags.
		 * Before assigning, tags should always be made lowercase.
		 */
		tags: schema.fields.array({
			items: schema.fields.string(),
		}),
		mainImage: schema.fields.file({
			nullable: true,
		}),
		cookCount: schema.fields.number({
			default: 0,
		}),
		lastCookedAt: schema.fields.number({
			nullable: true,
		}),
		lastAddedAt: schema.fields.number({
			nullable: true,
		}),
		addIntervalGuess: schema.fields.number({
			nullable: true,
		}),
		pinnedAt: schema.fields.number({
			nullable: true,
		}),
		subRecipeMultipliers: schema.fields.map({
			values: schema.fields.number(),
		}),
		copyOf: schema.fields.string({
			nullable: true,
		}),
	},
	indexes: {
		slug: {
			field: 'slug',
		},
		updatedAt: {
			field: 'updatedAt',
		},
		pinnedAt: {
			field: 'pinnedAt',
		},
		// makes tags indexable individually
		tag: {
			type: 'string[]',
			compute: (recipe) => {
				return recipe.tags;
			},
		},
		// similar algorithm to food recommendation engine,
		// but only tracking adding to shopping list
		suggestAfter: {
			type: 'number',
			compute: (recipe) => {
				if (
					!recipe.lastAddedAt ||
					!recipe.addIntervalGuess ||
					recipe.cookCount < 2
				)
					return Number.MAX_SAFE_INTEGER;
				return recipe.lastAddedAt + recipe.addIntervalGuess;
			},
		},
		food: {
			type: 'string[]',
			compute: (recipe) => {
				return recipe.ingredients
					.map((i) => i.food)
					.filter((f): f is string => !!f)
					.map((f) => f.toLowerCase());
			},
		},
		titleMatch: {
			type: 'string[]',
			compute: (recipe) => fullTextIndex(recipe.title),
		},
		generalSearch: {
			type: 'string[]',
			compute: (recipe) => [
				...fullTextIndex(recipe.title),
				...recipe.ingredients
					.map((i) => i.food)
					.filter((f): f is string => !!f)
					.map((f) => f.toLowerCase()),
			],
		},
		sessionStartedAt: {
			type: 'number',
			compute: (recipe) => {
				return recipe.session?.startedAt || 0;
			},
		},
		copyOf: {
			type: 'string',
			field: 'copyOf',
		},
	},
});
