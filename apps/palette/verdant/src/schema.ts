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

const projects = schema.collection({
	name: 'project',
	primaryKey: 'id',
	fields: {
		id: schema.fields.id(),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		image: schema.fields.file({
			downloadRemote: true,
		}),
		colors: schema.fields.array({
			items: schema.fields.object({
				properties: {
					id: schema.fields.id(),
					pixel: schema.fields.object({
						properties: {
							x: schema.fields.number(),
							y: schema.fields.number(),
						},
					}),
					percentage: schema.fields.object({
						properties: {
							x: schema.fields.number(),
							y: schema.fields.number(),
						},
					}),
					value: schema.fields.object({
						properties: {
							r: schema.fields.number(),
							g: schema.fields.number(),
							b: schema.fields.number(),
						},
					}),
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
	version: 2,
	collections: {
		projects,
	},
});
