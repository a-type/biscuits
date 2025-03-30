import { schema } from '@verdant-web/store';
import {
	createTipTapFieldSchema,
	createTipTapFileMapSchema,
} from '@verdant-web/tiptap';

/**
 * Welcome to your Verdant schema!
 *
 * The schema is where you define your data model.
 *
 * Read more at https://verdant.dev/docs/local-storage/schema
 *
 * The code below is provided as an example, but you'll
 * probably want to delete it and replace it with your
 * own schema.
 *
 * The schema is used to generate the client code for Verdant.
 * After you've replaced this example schema, run `pnpm generate -f`
 * in the root directory to bootstrap your client.
 *
 * For subsequent changes to your schema, use just `pnpm generate`.
 */

const posts = schema.collection({
	name: 'post',
	primaryKey: 'id',
	fields: {
		id: schema.fields.id(),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		title: schema.fields.string(),
		body: createTipTapFieldSchema({
			default: {
				type: 'doc',
			},
		}),
		files: createTipTapFileMapSchema(),
		summary: schema.fields.string({
			nullable: true,
		}),
		coverImage: schema.fields.file({
			nullable: true,
		}),
		notebookId: schema.fields.string({
			nullable: true,
			documentation:
				'The ID of the notebook this post belongs to, if any. If null, the post is not in a notebook.',
		}),
	},
	indexes: {
		createdAt: {
			field: 'createdAt',
		},
		notebookId: {
			field: 'notebookId',
		},
	},
	compounds: {
		notebookId_createdAt: {
			of: ['notebookId', 'createdAt'],
		},
	},
});

const notebooks = schema.collection({
	name: 'notebook',
	primaryKey: 'id',
	fields: {
		id: schema.fields.id(),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		name: schema.fields.string(),
		coverImage: schema.fields.file({
			nullable: true,
		}),
		icon: schema.fields.file({
			nullable: true,
		}),
		publishedTitle: schema.fields.string({
			nullable: true,
		}),
		description: createTipTapFieldSchema({
			default: {
				type: 'doc',
			},
		}),
		theme: schema.fields.object({
			properties: {
				primaryColor: schema.fields.string({
					default: 'blueberry',
					options: ['lemon', 'blueberry', 'tomato', 'leek', 'eggplant', 'salt'],
				}),
				fontStyle: schema.fields.string({
					default: 'sans-serif',
					options: ['serif', 'sans-serif'],
				}),
				spacing: schema.fields.string({
					default: 'md',
					options: ['sm', 'md', 'lg'],
				}),
			},
		}),
	},
	indexes: {
		name: {
			field: 'name',
		},
	},
});

export default schema({
	version: 6,
	collections: {
		posts,
		notebooks,
	},
});
