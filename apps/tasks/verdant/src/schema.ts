import { fullTextIndex } from '@biscuits/client/schema';
import { schema } from '@verdant-web/store';

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

const tasks = schema.collection({
	name: 'task',
	primaryKey: 'id',
	fields: {
		id: schema.fields.id(),
		title: schema.fields.string({
			default: '',
		}),
		details: schema.fields.string({
			nullable: true,
		}),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		recurrence: schema.fields.object({
			nullable: true,
			fields: {
				interval: schema.fields.number({
					default: 1,
				}),
				unit: schema.fields.string({
					options: ['day', 'week', 'month', 'year'],
					default: 'day',
				}),
			},
		}),
		completions: schema.fields.array({
			items: schema.fields.object({
				fields: {
					id: schema.fields.id(),
					completedAt: schema.fields.number({
						default: () => Date.now(),
					}),
					completedBy: schema.fields.string({
						nullable: true,
					}),
				},
			}),
		}),
		blocks: schema.fields.array({
			documentation: 'The ids of tasks that this task blocks',
			items: schema.fields.string(),
		}),
		scale: schema.fields.number({
			nullable: true,
		}),
	},
	indexes: {
		createdAt: {
			field: 'createdAt',
		},
		search: {
			type: 'string[]',
			compute: (item) => [
				...fullTextIndex(item.title),
				...fullTextIndex(item.details ?? ''),
			],
		},
		scale: {
			field: 'scale',
		},
		// lookup by the number of blockers for this item
		blockCount: {
			type: 'number',
			compute: (item) => item.blocks.length,
		},
		// lookup items by a blocking item id
		blocks: {
			type: 'string[]',
			compute: (item) => item.blocks,
		},
		scheduledAt: {
			type: 'number',
			compute: (item) => {
				if (!item.recurrence) {
					return Number.MAX_SAFE_INTEGER;
				}
				const lastCompletion = item.completions.reduce((latest, completion) => {
					return Math.max(latest, completion.completedAt);
				}, item.createdAt);
				const { interval, unit } = item.recurrence;
				let nextScheduledAt = lastCompletion;
				switch (unit) {
					case 'day':
						nextScheduledAt += interval * 24 * 60 * 60 * 1000;
						break;
					case 'week':
						nextScheduledAt += interval * 7 * 24 * 60 * 60 * 1000;
						break;
					case 'month':
						nextScheduledAt += interval * 30 * 24 * 60 * 60 * 1000;
						break;
					case 'year':
						nextScheduledAt += interval * 365 * 24 * 60 * 60 * 1000;
						break;
				}
				return nextScheduledAt;
			},
		},
	},
});

const playlists = schema.collection({
	name: 'playlist',
	primaryKey: 'id',
	fields: {
		id: schema.fields.id(),
		name: schema.fields.string({
			default: '',
		}),
		items: schema.fields.array({
			items: schema.fields.string(),
		}),
	},
	indexes: {
		name: {
			field: 'name',
		},
	},
});

export default schema({
	version: 1,
	collections: {
		tasks,
		playlists,
	},
});
