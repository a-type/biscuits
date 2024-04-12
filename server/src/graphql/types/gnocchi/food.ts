import { Food as DBFood, id, sql } from '@biscuits/db';
import { builder } from '../../builder.js';
import { createResults, keyIndexes } from '../../dataloaders/index.js';
import { assignTypeName, hasTypeName } from '../../relay.js';
import { BiscuitsError } from '@biscuits/error';
import { FoodCategory } from './foodCategory.js';
import { logger } from '../../../logger.js';
import { decodeGlobalID } from '@pothos/plugin-relay';

builder.queryFields((t) => ({
  food: t.field({
    type: Food,
    args: {
      name: t.arg.string(),
      id: t.arg.globalID(),
    },
    nullable: true,
    resolve: async (_, { name, id }, ctx) => {
      if (id) {
        if (id.typename !== 'Food') {
          throw new BiscuitsError(BiscuitsError.Code.NotFound);
        }
        return id.id;
      }

      if (!name) {
        throw new BiscuitsError(
          BiscuitsError.Code.BadRequest,
          'name or id is required',
        );
      }
      const food = await ctx.db
        .selectFrom('Food')
        .selectAll()
        .where('canonicalName', '=', name)
        .executeTakeFirst();

      if (food) {
        return assignTypeName('Food')(food);
      }

      // try alternate names
      const foodName = await ctx.db
        .selectFrom('FoodName')
        .select('foodId')
        .where('name', '=', name)
        .executeTakeFirst();

      if (foodName) {
        return foodName.foodId;
      }

      return null;
    },
  }),
}));

builder.mutationFields((t) => ({
  assignFoodCategory: t.field({
    type: 'AssignFoodCategoryResult',
    args: {
      input: t.arg({
        type: 'AssignFoodCategoryInput',
        required: true,
      }),
    },
    resolve: async (_, { input }, ctx) => {
      // find the food by name
      let food = await ctx.db
        .selectFrom('Food')
        .select('id')
        .where('canonicalName', '=', input.foodName)
        .executeTakeFirst();

      if (!food) {
        food = await ctx.db
          .selectFrom('FoodName')
          .select('foodId as id')
          .where('name', '=', input.foodName)
          .executeTakeFirst();
      }

      if (!food) {
        // create a new food
        food = await ctx.db
          .insertInto('Food')
          .values({ canonicalName: input.foodName, id: id() })
          .returning('id')
          .executeTakeFirst();
      }

      if (!food) {
        logger.urgent('Failed to create food for category assignment', {
          input,
        });
        throw new BiscuitsError(BiscuitsError.Code.Unexpected);
      }

      // upsert category assignment - increment votes if it already exists
      const categoryId = input.categoryId.toString();
      try {
        await ctx.db
          .insertInto('FoodCategoryAssignment')
          .values({
            foodId: food.id,
            categoryId,
            votes: 1,
          })
          .onConflict((oc) =>
            oc.columns(['foodId', 'categoryId']).doUpdateSet((eb) => ({
              votes: sql<number>`FoodCategoryAssignment.votes + 1`,
            })),
          )
          .execute();
      } catch (err) {
        if (err instanceof Error && err.message.includes('FOREIGN KEY')) {
          throw new BiscuitsError(
            BiscuitsError.Code.BadRequest,
            'Invalid category',
          );
        }
        throw err;
      }

      return { foodId: food.id };
    },
  }),
}));

export const Food = builder.loadableNodeRef('Food', {
  load: async (ids, ctx) => {
    const foods = await ctx.db
      .selectFrom('Food')
      .selectAll()
      .where('id', 'in', ids as string[])
      .execute();

    const indexes = keyIndexes(ids);

    const results = createResults<DBFood & { __typename: 'Food' }>(ids);
    for (const result of foods) {
      results[indexes[result.id]] = assignTypeName('Food')(result);
    }

    return results;
  },
  id: {
    resolve: (food) => food.id,
  },
});
Food.implement({
  description: 'Information about a food in Gnocchi',

  isTypeOf: hasTypeName('Food'),
  fields: (t) => ({
    canonicalName: t.exposeString('canonicalName'),
    alternateNames: t.field({
      type: ['String'],
      resolve: async (food, _, ctx) => {
        const names = await ctx.db
          .selectFrom('FoodName')
          .select('name')
          .where('foodId', '=', food.id)
          .execute();

        return names.map((name) => name.name);
      },
    }),
    category: t.field({
      type: FoodCategory,
      nullable: true,
      resolve: async (food, _, ctx) => {
        const category = await ctx.db
          .selectFrom('FoodCategoryAssignment')
          .select('categoryId')
          .where('foodId', '=', food.id)
          .executeTakeFirst();

        if (category) {
          return category.categoryId;
        }

        return null;
      },
    }),
  }),
});

builder.inputType('AssignFoodCategoryInput', {
  fields: (t) => ({
    foodName: t.field({ type: 'String', required: true }),
    categoryId: t.id({ required: true }),
  }),
});

builder.objectType('AssignFoodCategoryResult', {
  fields: (t) => ({
    food: t.field({
      type: Food,
      resolve: (r) => r.foodId,
    }),
  }),
});
