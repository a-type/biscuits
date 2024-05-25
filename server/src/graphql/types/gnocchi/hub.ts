import { BiscuitsError } from '@biscuits/error';
import { GNOCCHI_HUB_ORIGIN } from '../../../config/deployedContext.js';
import { builder } from '../../builder.js';
import { assignTypeName, hasTypeName } from '../../relay.js';

builder.queryFields((t) => ({
  publishedRecipe: t.field({
    type: 'PublishedRecipe',
    authScopes: {
      member: true,
    },
    nullable: true,
    args: {
      id: t.arg.id({
        required: true,
      }),
    },
    resolve: async (_, { id }, ctx) => {
      const planId = ctx.session?.planId;
      if (!planId) {
        throw new BiscuitsError(
          BiscuitsError.Code.Forbidden,
          'You must be a member to view a published recipe',
        );
      }

      const publishedRecipe = await ctx.db
        .selectFrom('PublishedRecipe')
        .selectAll()
        .where('id', '=', id)
        .where('planId', '=', planId)
        .executeTakeFirst();

      if (!publishedRecipe) return null;

      return assignTypeName('PublishedRecipe')(publishedRecipe);
    },
  }),
}));

builder.mutationFields((t) => ({
  publishRecipe: t.field({
    type: 'PublishedRecipe',
    authScopes: {
      member: true,
    },
    args: {
      input: t.arg({
        type: 'PublishRecipeInput',
        required: true,
      }),
    },
    resolve: async (_, { input }, ctx) => {
      const { id, slug } = input;
      const planId = ctx.session?.planId;
      const userId = ctx.session?.userId;
      if (!planId || !userId) {
        throw new BiscuitsError(
          BiscuitsError.Code.Forbidden,
          'You must be a member to publish a recipe',
        );
      }

      const recipe = await ctx.db
        .insertInto('PublishedRecipe')
        .values({
          id,
          planId,
          slug,
          publishedAt: new Date(),
          publishedBy: userId,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return assignTypeName('PublishedRecipe')(recipe);
    },
  }),

  unpublishRecipe: t.field({
    type: 'ID',
    authScopes: {
      member: true,
    },
    args: {
      recipeId: t.arg.id({
        required: true,
      }),
    },
    resolve: async (_, { recipeId }, ctx) => {
      const planId = ctx.session?.planId;
      if (!planId) {
        throw new BiscuitsError(
          BiscuitsError.Code.Forbidden,
          'You must be a member to unpublish a recipe',
        );
      }

      await ctx.db
        .deleteFrom('PublishedRecipe')
        .where('id', '=', recipeId)
        .where('planId', '=', planId)
        .execute();

      return recipeId;
    },
  }),
}));

builder.objectType('PublishedRecipe', {
  description: 'A published recipe',

  isTypeOf: hasTypeName('PublishedRecipe'),
  fields: (t) => ({
    id: t.exposeID('id'),
    publishedAt: t.expose('publishedAt', {
      type: 'DateTime',
    }),
    url: t.string({
      resolve: (source, _, ctx) => {
        return GNOCCHI_HUB_ORIGIN + `/${source.planId}/${source.slug}`;
      },
    }),
  }),
});

builder.inputType('PublishRecipeInput', {
  fields: (t) => ({
    id: t.id({
      description: 'The ID of the recipe to publish',
      required: true,
    }),
    slug: t.string({
      description: 'The slug for the published recipe',
      required: true,
    }),
  }),
});
