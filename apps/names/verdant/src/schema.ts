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

const people = schema.collection({
	name: 'person',
	primaryKey: 'id',
	fields: {
		id: schema.fields.string({
			default: schema.generated.id,
		}),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		name: schema.fields.string(),
		geolocation: schema.fields.object({
			properties: {
				latitude: schema.fields.number(),
				longitude: schema.fields.number(),
				label: schema.fields.string({
					nullable: true,
				}),
			},
			nullable: true,
		}),
		note: schema.fields.string({
			nullable: true,
		}),
		photo: schema.fields.file({
			nullable: true,
		}),
		createdBy: schema.fields.string({
			nullable: true,
		}),
		tags: schema.fields.array({
			items: schema.fields.string(),
		}),
		dismissedSuggestions: schema.fields.array({
			items: schema.fields.string(),
		}),
	},
	indexes: {
		createdAt: {
			field: 'createdAt',
		},
		matchText: {
			type: 'string[]',
			compute: (person) =>
				person.name
					.toLowerCase()
					.split(/\s+/)
					.concat(person.note?.toLowerCase().split(/\s+/) ?? [])
					.concat(person.geolocation?.label?.toLowerCase().split(/\s+/) ?? []),
		},
		matchName: {
			type: 'string[]',
			compute: (person) => person.name.toLowerCase().split(/\s+/),
		},
		matchNote: {
			type: 'string[]',
			compute: (person) => person.note?.toLowerCase().split(/\s+/) ?? [],
		},
		matchLocation: {
			type: 'string[]',
			compute: (person) =>
				person.geolocation?.label?.toLowerCase().split(/\s+/) ?? [],
		},
		latitude: {
			type: 'number',
			compute: (person) => person.geolocation?.latitude ?? -10000,
		},
		longitude: {
			type: 'number',
			compute: (person) => person.geolocation?.longitude ?? -10000,
		},
		tags: {
			type: 'string[]',
			compute: (person) => person.tags,
		},
	},
	compounds: {
		tag_createdAt: {
			of: ['tags', 'createdAt'],
		},
	},
});

const relationships = schema.collection({
	name: 'relationship',
	primaryKey: 'id',
	fields: {
		id: schema.fields.id(),
		personAId: schema.fields.string(),
		personALabel: schema.fields.string({ nullable: true }),
		personBId: schema.fields.string(),
		personBLabel: schema.fields.string({ nullable: true }),
	},
	indexes: {
		personId: {
			type: 'string[]',
			compute: (relationship) => [
				relationship.personAId,
				relationship.personBId,
			],
		},
	},
});

const tags = schema.collection({
	name: 'tag',
	primaryKey: 'name',
	fields: {
		name: schema.fields.string(),
		color: schema.fields.string({ nullable: true }),
		icon: schema.fields.string({ nullable: true }),
	},
});

export default schema({
	version: 3,
	collections: {
		people,
		relationships,
		tags,
	},
});
