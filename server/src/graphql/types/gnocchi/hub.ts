import { BiscuitsError } from '@biscuits/error';
import { builder } from '../../builder.js';
import { assignTypeName, hasTypeName } from '../../relay.js';
import { serverRender } from '@gnocchi.biscuits/hub';

builder.queryFields((t) => ({
  publishedRecipe: t.field({
    type: PublishedRecipe,
    authScopes: {
      member: true,
    },
    nullable: true,
    args: {
      id: t.arg.id(),
    },
    resolve: (_, { id }) => id,
  }),
}));

builder.mutationFields((t) => ({
  publishRecipe: t.field({
    type: PublishedRecipe,
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
      if (!planId) {
        throw new BiscuitsError(
          BiscuitsError.Code.Forbidden,
          'You must be a member to publish a recipe',
        );
      }

      await ctx.ssg.gnocchiHub.upload(`${planId}/${slug}`, serverRender());

      await ctx.db
        .insertInto('PublishedRecipe')
        .values({ id, planId, slug, publishedAt: new Date() })
        .executeTakeFirst();

      return id;
    },
  }),
}));

const PublishedRecipe = builder.loadableNodeRef('PublishedRecipe', {
  id: {
    resolve: (source) => source.id,
  },
  load: async (ids, ctx) => {
    if (!ctx.session?.planId) {
      throw new BiscuitsError(
        BiscuitsError.Code.Forbidden,
        'You must be a member to view a published recipe',
      );
    }
    const planId = ctx.session.planId;
    const recipes = await Promise.all(
      ids.map(async (id) => {
        const recipe = await ctx.db
          .selectFrom('PublishedRecipe')
          .where('id', '=', id)
          .where('planId', '=', planId)
          .selectAll()
          .executeTakeFirst();

        if (!recipe) return null;

        return assignTypeName('PublishedRecipe')(recipe);
      }),
    );
    return recipes;
  },
});

PublishedRecipe.implement({
  description: 'A published recipe',

  isTypeOf: hasTypeName('PublishedRecipe'),
  fields: (t) => ({
    publishedAt: t.expose('publishedAt', {
      type: 'DateTime',
    }),
    url: t.string({
      resolve: (source, _, ctx) => {
        return ctx.ssg.gnocchiHub.origin + `/${source.planId}/${source.slug}`;
      },
    }),
  }),
});
