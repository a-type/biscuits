import { db, id, jsonArrayFrom } from '@biscuits/db';
import { BiscuitsError } from '../error.js';
import { stripe } from '../services/stripe.js';
import { email } from '../services/email.js';
import { UI_ORIGIN } from '../config/deployedContext.js';

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

      // when the only admin leaves, we always cancel the subscription, too.
      if (plan.stripeSubscriptionId) {
        await stripe.subscriptions.cancel(plan.stripeSubscriptionId);
      }

      const newAdmin = plan.members.find((m) => m.planRole === 'user');
      if (!newAdmin) {
        // no other users, so delete the plan.
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
        const newAdminDetails = await tx
          .updateTable('User')
          .where('id', '=', newAdmin.id)
          .set({
            planRole: 'admin',
          })
          .returning(['id', 'email', 'fullName'])
          .executeTakeFirstOrThrow();

        // send an email to the new admin about their new role
        await email.sendMail({
          to: newAdminDetails.email,
          subject: 'You are now the admin of your Biscuits plan',
          text: `Hi ${newAdminDetails.fullName},\n\nYou are now the admin of your Biscuits plan. You can manage your plan at ${UI_ORIGIN}/plans/${planId}.\n\nThanks,\nGrant`,
          html: `Hi ${newAdminDetails.fullName},<br><br>You are now the admin of your Biscuits plan. You can manage your plan at <a href="${UI_ORIGIN}/plans/${planId}">${UI_ORIGIN}/plans/${planId}</a>.<br><br>Thanks,<br>Grant`,
        });
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
