import { schema } from '@verdant-web/store';
import { getDay, startOfDay } from 'date-fns';

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
		createdBy: schema.fields.string({
			nullable: true,
		}),
		value: schema.fields.number({
			nullable: true,
		}),
		tags: schema.fields.array({
			items: schema.fields.string(),
		}),
		weather: schema.fields.object({
			nullable: true,
			fields: {
				unit: schema.fields.string({
					options: ['F', 'C', 'K'],
				}),
				high: schema.fields.number({ nullable: true }),
				low: schema.fields.number({ nullable: true }),
				precipitationMM: schema.fields.number({ nullable: true }),
			},
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
		weekday: {
			type: 'number',
			compute(value) {
				return getDay(new Date(value.createdAt));
			},
		},
	},
	compounds: {
		createdBy_date: {
			of: ['createdBy', 'date'],
		},
	},
});

const tagMetadata = schema.collection({
	name: 'tagMetadata',
	primaryKey: 'id',
	fields: {
		id: schema.fields.id(),
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
		color: schema.fields.string({
			nullable: true,
		}),
	},
	indexes: {
		value: {
			field: 'value',
		},
		useCount: {
			field: 'useCount',
		},
		lastUsedAt: {
			field: 'lastUsedAt',
		},
	},
});

export default schema({
	version: 2,
	collections: {
		entries,
		tagMetadata,
	},
});
