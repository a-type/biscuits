import { Kysely } from 'kysely';

// drop unique invite constraint

export async function up(db: Kysely<any>) {
  // so that the dev server doesn't immediately apply a no-op.
  await db.schema.dropIndex('PlanInvitation_planId_email').execute();
}

export async function down(db: Kysely<any>) {
  // make planId + email unique for invites
  await db.schema
    .createIndex('PlanInvitation_planId_email')
    .on('PlanInvitation')
    .columns(['planId', 'email'])
    .unique()
    .execute();
}
