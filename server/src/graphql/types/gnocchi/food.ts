import { Food as DBFood, id, sql } from '@biscuits/db';
import { builder } from '../../builder.js';
import { createResults, keyIndexes } from '../../dataloaders/index.js';
import { assignTypeName, hasTypeName } from '../../relay.js';
import { BiscuitsError } from '@biscuits/error';
import { FoodCategory } from './foodCategory.js';
import { logger } from '../../../logger.js';
import { decodeGlobalID } from '@pothos/plugin-relay';
import { fromCursor, toCursor } from '../cursors.js';

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
  foods: t.connection({
    type: Food,
    authScopes: {
      productAdmin: true,
    },
    args: {
      startsWith: t.arg.string(),
    },
    resolve: async (_, args, ctx) => {
      const { first: providedFirst, after } = args;
      const first = providedFirst || 50;
      const query = ctx.db.selectFrom('Food').selectAll();

      if (args.startsWith) {
        query.where('canonicalName', 'like', `${args.startsWith}%`);
      }

      if (after) {
        const name = fromCursor(after);
        query.where('canonicalName', '>', name);
      }

      const foods = await query.limit(first).execute();

      const firstFood = foods[0];
      const lastFood = foods[foods.length - 1];

      return {
        edges: foods.map((food) => ({
          node: assignTypeName('Food')(food),
          cursor: toCursor(food.canonicalName),
        })),
        pageInfo: {
          hasNextPage: foods.length === first,
          endCursor: lastFood ? toCursor(lastFood.canonicalName) : undefined,
          hasPreviousPage: true,
          startCursor: firstFood
            ? toCursor(firstFood.canonicalName)
            : undefined,
        },
      };
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
  addFoodName: t.field({
    type: 'String',
    args: {
      foodId: t.arg.id({ required: true }),
      name: t.arg.string({ required: true }),
    },
    authScopes: {
      productAdmin: true,
    },
    resolve: async (_, { foodId, name }, ctx) => {
      await ctx.db.insertInto('FoodName').values({ foodId, name }).execute();

      return name;
    },
  }),
  removeFoodName: t.field({
    type: Food,
    args: {
      foodId: t.arg.id({ required: true }),
      name: t.arg.string({ required: true }),
    },
    authScopes: {
      productAdmin: true,
    },
    resolve: async (_, { foodId, name }, ctx) => {
      await ctx.db
        .deleteFrom('FoodName')
        .where('foodId', '=', foodId)
        .where('name', '=', name)
        .execute();

      return foodId;
    },
  }),
  changeFoodCanonicalName: t.field({
    type: Food,
    args: {
      foodId: t.arg.id({ required: true }),
      name: t.arg.string({ required: true }),
    },
    authScopes: {
      productAdmin: true,
    },
    resolve: async (_, { foodId, name }, ctx) => {
      await ctx.db
        .updateTable('Food')
        .set({ canonicalName: name })
        .where('id', '=', foodId)
        .execute();

      return foodId;
    },
  }),
  overrideFoodCategory: t.field({
    type: 'AssignFoodCategoryResult',
    args: {
      foodId: t.arg.id({ required: true }),
      categoryId: t.arg.id({ required: true }),
    },
    authScopes: {
      productAdmin: true,
    },
    resolve: async (_, { foodId, categoryId }, ctx) => {
      await ctx.db
        .insertInto('FoodCategoryAssignment')
        .values({
          foodId,
          categoryId,
          votes: 10000,
        })
        .onConflict((oc) =>
          oc.columns(['foodId', 'categoryId']).doUpdateSet((eb) => ({
            votes: 10000,
          })),
        )
        .execute();

      return { foodId };
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
