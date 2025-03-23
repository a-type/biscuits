import { db } from '@biscuits/db';
import { decomposeOid } from '@verdant-web/common';
import { ChangeHandler } from '../changeHander.js';

export const postDeleteTracker: ChangeHandler<{
	postId: string;
}> = {
	match: (data) => data.appId === 'post',
	process: async (info, get, schedule) => {
		for (const { data, oid } of info.operations) {
			if (data.op === 'delete') {
				const { collection, id, subId } = decomposeOid(oid);
				if (collection === 'posts' && !subId) {
					schedule({
						postId: id,
					});
				}
			}
		}
	},
	effect: async (planId, userId, payload) => {
		console.info(
			`Post deleted: ${payload.postId}. Removing published copy, if any.`,
		);
		const result = await db
			.deleteFrom('PublishedPost')
			.innerJoin(
				'PublishedNotebook',
				'PublishedPost.notebookId',
				'PublishedNotebook.id',
			)
			.where('PublishedPost.id', '=', payload.postId)
			.where('PublishedNotebook.planId', '=', planId)
			.returningAll()
			.execute();
		if (result.length > 0) {
			console.info(
				`Removed published post with ID: ${payload.postId}, Slug: ${result[0].slug}, Title: ${result[0].title}`,
			);
		}
	},
};
