import { db } from '@biscuits/db';

const productAdmins = (process.env.MAKE_PRODUCT_ADMIN || '').split(',');

export async function productAdminSetup() {
  for (const email of productAdmins) {
    const profile = await db
      .selectFrom('Profile')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
    if (profile && !profile.isProductAdmin) {
      await db
        .updateTable('Profile')
        .where('id', '=', profile.id)
        .set({ isProductAdmin: true })
        .executeTakeFirst();

      console.log('Made', email, 'a product admin');
    }
  }
}
