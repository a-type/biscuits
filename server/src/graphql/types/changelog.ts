import { id } from '@biscuits/db';
import { builder } from '../builder.js';
import { assignTypeName } from '../relay.js';

builder.queryFields((t) => ({
	changelog: t.field({
		type: ['ChangelogItem'],
		args: {
			appId: t.arg.string({
				description: 'The ID of the app to fetch the changelog for',
				required: true,
			}),
		},
		resolve: async (_, args, { db }) => {
			const items = await db
				.selectFrom('ChangelogItem')
				.selectAll()
				.where('appId', '=', args.appId || 'gnocchi')
				.orderBy('createdAt', 'desc')
				.execute();
			return items.map(assignTypeName('ChangelogItem'));
		},
	}),
}));

builder.mutationFields((t) => ({
	createChangelogItem: t.field({
		type: 'ChangelogItem',
		args: {
			input: t.arg({
				type: 'CreateChangelogItemInput',
				required: true,
			}),
		},
		authScopes: {
			productAdmin: true,
		},
		resolve: async (_, { input }, { db }) => {
			const result = await db
				.insertInto('ChangelogItem')
				.values({
					id: id(),
					title: input.title,
					details: input.details,
					imageUrl: input.imageUrl,
					important: !!input.important,
					appId: input.appId,
				})
				.returningAll()
				.executeTakeFirst();
			if (!result) {
				throw new Error('Failed to create changelog item');
			}
			return assignTypeName('ChangelogItem')(result);
		},
	}),
	deleteChangelogItem: t.field({
		type: 'ChangelogItem',
		args: {
			id: t.arg.string({
				description: 'The ID of the changelog item to delete',
				required: true,
			}),
		},
		authScopes: {
			productAdmin: true,
		},
		resolve: async (_, { id }, { db }) => {
			const result = await db
				.deleteFrom('ChangelogItem')
				.where('id', '=', id)
				.returningAll()
				.executeTakeFirst();
			if (!result) {
				throw new Error('Failed to delete changelog item');
			}
			return assignTypeName('ChangelogItem')(result);
		},
	}),
}));

builder.objectType('ChangelogItem', {
	description: 'A single item in the changelog',
	fields: (t) => ({
		id: t.exposeID('id'),
		createdAt: t.expose('createdAt', { type: 'DateTime' }),
		updatedAt: t.expose('updatedAt', { type: 'DateTime', nullable: true }),
		title: t.exposeString('title'),
		details: t.exposeString('details'),
		imageUrl: t.exposeString('imageUrl', {
			nullable: true,
		}),
		important: t.exposeBoolean('important'),
	}),
});

builder.inputType('CreateChangelogItemInput', {
	description: 'Input for creating a new changelog item',
	fields: (t) => ({
		title: t.string({
			description: 'The title of the changelog item',
			required: true,
		}),
		details: t.string({
			description: 'The details of the changelog item',
			required: true,
		}),
		imageUrl: t.string({
			description: 'The URL of an image to display with the changelog item',
		}),
		important: t.boolean({
			description: 'Whether this item is important',
			defaultValue: false,
		}),
		appId: t.string({
			description: 'The ID of the app this changelog item is for',
			required: true,
		}),
	}),
});
