import { db, id, jsonArrayFrom } from '@biscuits/db';
import { BiscuitsError } from '../error.js';
import { stripe } from '../services/stripe.js';

export async function removeUserFromPlan(
  planId: string,
  userId: string,
): Promise<void> {
  await db.transaction().execute(async (tx) => {
    // if user was admin of their plan and there are no other admins,
    // promote another user to admin. if there are no other users,
    // delete the plan
    const plan = await tx
      .selectFrom('Plan')
      .select(['id', 'stripeSubscriptionId', 'stripeCustomerId'])
      .where('id', '=', planId)
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('User')
            .select(['id', 'planRole'])
            .whereRef('planId', '=', 'Plan.id'),
        ).as('members'),
      ])
      .executeTakeFirst();

    if (!plan) {
      throw new BiscuitsError(BiscuitsError.Code.NoPlan);
    }

    const userMember = plan.members.find((m) => m.id === userId);
    if (!userMember) {
      console.error('User not found in plan despite select matching', {
        planId,
        userId,
      });
      throw new BiscuitsError(BiscuitsError.Code.Unexpected);
    }

    // if they're not an admin, just remove them. if there's
    // another admin, we can rely on them.
    const canJustDeleteThem =
      userMember.planRole !== 'admin' ||
      plan.members.filter((m) => m.planRole === 'admin').length > 1;
    if (!canJustDeleteThem) {
      // user was the only admin, so we need to promote someone else
      const newAdmin = plan.members.find((m) => m.planRole === 'user');
      if (!newAdmin) {
        // no other users, so delete the plan. but we also need to cancel
        // the subscription.
        if (plan.stripeSubscriptionId) {
          await stripe.subscriptions.cancel(plan.stripeSubscriptionId);
        }

        await tx.deleteFrom('Plan').where('id', '=', planId).execute();
        await tx
          .insertInto('ActivityLog')
          .values({
            action: 'deletePlan',
            id: id(),
            userId,
            data: JSON.stringify({
              planId,
              reason: 'all users left',
            }),
          })
          .execute();
        return;
      } else {
        // promote the new admin
        await tx
          .updateTable('User')
          .where('id', '=', newAdmin.id)
          .set({
            planRole: 'admin',
          })
          .execute();
      }
    }

    // null out the old admin's planId and planRole
    await tx
      .updateTable('User')
      .where('id', '=', userId)
      .set({
        planId: null,
        planRole: null,
      })
      .execute();
  });
}
