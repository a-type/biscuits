/** @generated - do not modify this file. */

// src/client/schemaVersions/v8.ts
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
		sortKey: {
			type: 'string',
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
					quantity: {
						type: 'number',
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
	},
	synthetics: {
		purchased: {
			type: 'string',
			compute: (doc) => (!!doc.purchasedAt ? 'yes' : 'no'),
		},
	},
	compounds: {
		categoryId_sortKey: {
			of: ['categoryId', 'sortKey'],
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
var v8_default = schema({
	version: 8,
	collections: {
		categories,
		items,
		foodCategoryAssignments,
		suggestions,
	},
});
export { v8_default as default };
