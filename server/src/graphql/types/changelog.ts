import { id } from '@biscuits/db';
import { builder } from '../builder.js';
import { assignTypeName } from '../relay.js';

builder.queryFields((t) => ({
  changelog: t.field({
    type: ['ChangelogItem'],
    resolve: async (_, __, { db }) => {
      const items = await db
        .selectFrom('ChangelogItem')
        .selectAll()
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
        })
        .returningAll()
        .executeTakeFirst();
      if (!result) {
        throw new Error('Failed to create changelog item');
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
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
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
  }),
});
