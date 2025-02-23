import { schema } from '@verdant-web/store';
import { createTipTapFieldSchema } from '@verdant-web/tiptap';

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
		coverImage: schema.fields.file({
			nullable: true,
		}),
	},
	indexes: {
		createdAt: {
			field: 'createdAt',
		},
	},
});

export default schema({
	version: 1,
	collections: {
		posts,
	},
});
