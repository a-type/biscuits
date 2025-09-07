import { schema } from '@verdant-web/store';

const coordinateSchema = schema.fields.object({
	fields: {
		x: schema.fields.number(),
		y: schema.fields.number(),
	},
});

const floors = schema.collection({
	name: 'floor',
	primaryKey: 'id',
	fields: {
		id: schema.fields.string({
			default: schema.generated.id,
		}),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		name: schema.fields.string(),
		lines: schema.fields.array({
			items: schema.fields.object({
				fields: {
					start: coordinateSchema,
					end: coordinateSchema,
				},
			}),
		}),
		labels: schema.fields.array({
			items: schema.fields.object({
				fields: {
					position: coordinateSchema,
					content: schema.fields.string(),
				},
			}),
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
		floors,
	},
});
