/** @generated - do not modify this file. */

// src/client/schemaVersions/v15.ts
import { schema } from '@verdant-web/store';
import cuid from 'cuid';
var categories = schema.collection({
	name: 'category',
	pluralName: 'categories',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: () => cuid(),
		},
		name: {
			type: 'string',
		},
		sortKey: {
			type: 'string',
			indexed: true,
			default: 'a0',
		},
		/**
		 * An estimate of how long items in this category
		 * take to expire. If not specified, items will not
		 * auto-expire.
		 */
		expirationDays: {
			type: 'number',
			nullable: true,
		},
		/**
		 * Users can claim a category to be responsible for
		 * it. This is a reference to the user who claimed
		 * it by their ID. Claims expire after 24 hours.
		 */
		claim: {
			type: 'object',
			nullable: true,
			properties: {
				claimedBy: {
					type: 'string',
				},
				claimedAt: {
					type: 'number',
				},
			},
		},
	},
});
var foodCategoryAssignments = schema.collection({
	name: 'foodCategoryAssignment',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: () => cuid(),
		},
		foodName: {
			type: 'string',
			indexed: true,
		},
		categoryId: {
			type: 'string',
			indexed: true,
		},
		remote: {
			type: 'boolean',
		},
	},
});
var items = schema.collection({
	name: 'item',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: () => cuid(),
		},
		categoryId: {
			type: 'string',
			indexed: true,
			nullable: true,
		},
		createdAt: {
			type: 'number',
			default: () => Date.now(),
		},
		totalQuantity: {
			type: 'number',
		},
		unit: {
			type: 'string',
		},
		food: {
			type: 'string',
			indexed: true,
		},
		inputs: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					text: {
						type: 'string',
					},
					url: {
						type: 'string',
						nullable: true,
					},
					title: {
						type: 'string',
						nullable: true,
					},
					multiplier: {
						type: 'number',
						nullable: true,
					},
					recipeId: {
						type: 'string',
						nullable: true,
					},
				},
			},
		},
		/**
		 * Mark this when the item is purchased. It moves to the pantry.
		 */
		purchasedAt: {
			type: 'number',
			nullable: true,
		},
		/**
		 * This can be, and is, set in the future at the time of purchase
		 * based on category expiration settings.
		 */
		expiredAt: {
			type: 'number',
			nullable: true,
		},
		/**
		 * If assigned to a list, this ID will be
		 */
		listId: {
			type: 'string',
			nullable: true,
		},
	},
	synthetics: {
		purchased: {
			type: 'string',
			compute: (doc) => (!!doc.purchasedAt ? 'yes' : 'no'),
		},
		listId: {
			type: 'string',
			compute: (doc) => doc.listId,
		},
	},
	compounds: {
		purchased_food_listId: {
			of: ['purchased', 'food', 'listId'],
		},
		purchased_listId: {
			of: ['purchased', 'listId'],
		},
	},
});
var suggestions = schema.collection({
	name: 'suggestion',
	primaryKey: 'text',
	fields: {
		text: {
			type: 'string',
		},
		usageCount: {
			type: 'number',
			default: 0,
			indexed: true,
		},
	},
});
var lists = schema.collection({
	name: 'list',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: () => cuid(),
		},
		name: {
			type: 'string',
		},
		color: {
			type: 'string',
		},
	},
});
var collaborationInfo = schema.collection({
	name: 'collaborationInfo',
	pluralName: 'collaborationInfo',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: 'default',
		},
		meetup: {
			type: 'object',
			nullable: true,
			properties: {
				createdAt: {
					type: 'number',
					default: () => Date.now(),
				},
				location: {
					type: 'string',
				},
			},
		},
	},
});
var v15_default = schema({
	version: 15,
	collections: {
		categories,
		items,
		foodCategoryAssignments,
		suggestions,
		lists,
		collaborationInfo,
	},
});
export { v15_default as default };
