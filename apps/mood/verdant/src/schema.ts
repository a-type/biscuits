import { schema } from '@verdant-web/store';
import { startOfDay } from 'date-fns';

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

const entries = schema.collection({
	name: 'entry',
	primaryKey: 'id',
	fields: {
		id: schema.fields.id(),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		value: schema.fields.number({
			nullable: true,
		}),
		tags: schema.fields.array({
			items: schema.fields.string(),
		}),
	},
	indexes: {
		createdAt: {
			field: 'createdAt',
		},
		date: {
			type: 'number',
			compute(value) {
				const date = startOfDay(new Date(value.createdAt));
				return date.getTime();
			},
		},
	},
});

const tags = schema.collection({
	name: 'tag',
	primaryKey: 'value',
	fields: {
		value: schema.fields.string(),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		lastUsedAt: schema.fields.number({
			default: () => Date.now(),
		}),
		useCount: schema.fields.number({
			default: () => 0,
		}),
	},
	indexes: {
		useCount: {
			field: 'useCount',
		},
		lastUsedAt: {
			field: 'lastUsedAt',
		},
	},
});

export default schema({
	version: 1,
	collections: {
		entries,
		tags,
	},
});
