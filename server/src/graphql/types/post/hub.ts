import { BiscuitsError } from '@biscuits/error';
import { getLibraryName } from '@biscuits/libraries';
import { z } from 'zod';
import { POST_HUB_ORIGIN } from '../../../config/deployedContext.js';
import { POST_HUB_CLOUDFRONT_ID } from '../../../config/secrets.js';
import { verdantServer } from '../../../verdant/verdant.js';
import { builder } from '../../builder.js';
import { assignTypeName } from '../../relay.js';
import { User } from '../user.js';

builder.queryFields((t) => ({
	publishedPost: t.field({
		type: 'PublishedPost',
		args: {
			id: t.arg.id({
				required: true,
			}),
		},
		nullable: true,
		authScopes: {
			app: 'post',
		},
		resolve: async (_, { id }, ctx) => {
			const planId = ctx.session?.planId;
			if (!planId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to view a published post',
				);
			}

			const publishedPost = await ctx.db
				.selectFrom('PublishedPost')
				.selectAll()
				.innerJoin(
					'PublishedNotebook',
					'PublishedPost.notebookId',
					'PublishedNotebook.id',
				)
				.where('PublishedPost.id', '=', id)
				.where('PublishedNotebook.planId', '=', planId)
				.executeTakeFirst();

			if (!publishedPost) return null;

			return assignTypeName('PublishedPost')(publishedPost);
		},
	}),
	publishedNotebook: t.field({
		type: 'PublishedNotebook',
		args: {
			id: t.arg.id({
				required: true,
			}),
		},
		nullable: true,
		authScopes: {
			app: 'post',
		},
		resolve: async (_, { id }, ctx) => {
			const planId = ctx.session?.planId;
			if (!planId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to view a published notebook',
				);
			}

			const publishedNotebook = await ctx.db
				.selectFrom('PublishedNotebook')
				.selectAll()
				.where('id', '=', id)
				.where('planId', '=', planId)
				.executeTakeFirst();

			if (!publishedNotebook) return null;

			return assignTypeName('PublishedNotebook')(publishedNotebook);
		},
	}),
}));

builder.mutationFields((t) => ({
	publishPost: t.field({
		type: 'PublishPostResult',
		authScopes: {
			app: 'post',
		},
		args: {
			input: t.arg({
				type: 'PublishPostInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			const { notebook, post } = input;
			const planId = ctx.session?.planId;
			const userId = ctx.session?.userId;
			if (!planId || !userId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to publish a post',
				);
			}

			const libraryId = getLibraryName({
				planId,
				app: 'post',
				access: 'members',
				userId,
			});

			const validatedBody = richTextNodeSchema.parse(post.body);
			const validatedDescription =
				notebook.description ?
					richTextNodeSchema.parse(notebook.description)
				:	null;
			const validatedTheme =
				notebook.theme ? notebookThemeSchema.parse(notebook.theme) : null;

			let notebookCoverImageUrl: string | null = null;
			let notebookIconUrl: string | null = null;
			let postCoverImageUrl: string | null = null;

			if (notebook.coverImageId) {
				const notebookCoverImageInfo = await verdantServer.getFileData(
					libraryId,
					notebook.coverImageId,
				);
				notebookCoverImageUrl = notebookCoverImageInfo?.url ?? null;
			}
			if (notebook.iconId) {
				const notebookIconInfo = await verdantServer.getFileData(
					libraryId,
					notebook.iconId,
				);
				notebookIconUrl = notebookIconInfo?.url ?? null;
			}
			if (post.coverImageId) {
				const postCoverImageInfo = await verdantServer.getFileData(
					libraryId,
					post.coverImageId,
				);
				postCoverImageUrl = postCoverImageInfo?.url ?? null;
			}

			// upsert the notebook
			await ctx.db
				.insertInto('PublishedNotebook')
				.values({
					planId,
					publishedBy: userId,
					id: notebook.id,
					name: notebook.name,
					coverImageUrl: notebookCoverImageUrl,
					iconUrl: notebookIconUrl,
					description: validatedDescription,
					theme: validatedTheme,
				})
				.onConflict((cb) =>
					cb.column('id').doUpdateSet({
						name: notebook.name,
						coverImageUrl: notebookCoverImageUrl,
						iconUrl: notebookIconUrl,
						description: validatedDescription,
						theme: validatedTheme,
					}),
				)
				.executeTakeFirstOrThrow();

			// upsert the post
			await ctx.db
				.insertInto('PublishedPost')
				.values({
					notebookId: notebook.id,
					publishedBy: userId,
					id: post.id,
					slug: post.slug,
					title: post.title,
					summary: post.summary,
					coverImageUrl: postCoverImageUrl,
					body: validatedBody,
				})
				.onConflict((cb) =>
					cb.column('id').doUpdateSet({
						title: post.title,
						slug: post.slug,
						body: validatedBody,
						coverImageUrl: postCoverImageUrl,
					}),
				)
				.executeTakeFirstOrThrow();

			if (POST_HUB_CLOUDFRONT_ID) {
				// Invalidate the CloudFront cache for the published post
				// createInvalidation(POST_HUB_CLOUDFRONT_ID, [
				// 	/* todo */
				// ]);
			}

			return {
				notebookId: notebook.id,
				postId: post.id,
			};
		},
	}),

	unpublishPost: t.field({
		type: 'ID',
		authScopes: {
			app: 'post',
		},
		args: {
			postId: t.arg.id({
				required: true,
			}),
		},
		resolve: async (_, { postId }, ctx) => {
			const planId = ctx.session?.planId;
			if (!planId) {
				throw new BiscuitsError(
					BiscuitsError.Code.Forbidden,
					'You must be a member to unpublish a post',
				);
			}

			await ctx.db
				.deleteFrom('PublishedPost')
				.where('id', '=', postId)
				.execute();

			return postId;
		},
	}),
}));

builder.objectType('PublishedNotebook', {
	description: 'A published notebook',
	fields: (t) => ({
		id: t.exposeID('id', {
			description: 'The ID of the notebook',
		}),
		createdAt: t.expose('createdAt', {
			type: 'DateTime',
			description: 'The date and time the notebook was published',
		}),
		updatedAt: t.expose('updatedAt', {
			type: 'DateTime',
			nullable: true,
			description: 'The date and time the notebook was last updated',
		}),
		publishedBy: t.field({
			type: User,
			resolve: (source) => source.publishedBy,
			description: 'The ID of the user who published the notebook',
		}),
		name: t.exposeString('name', {
			description: 'The name of the notebook',
		}),
		coverImageUrl: t.exposeString('coverImageUrl', {
			description: 'The URL of the cover image for the notebook',
			nullable: true,
		}),
		iconUrl: t.exposeString('iconUrl', {
			description: 'The URL of the icon for the notebook',
			nullable: true,
		}),
		description: t.expose('description', {
			type: 'JSON',
			description: 'The description of the notebook',
		}),
	}),
});

builder.objectType('PublishedPost', {
	description: 'A published post',
	fields: (t) => ({
		id: t.exposeID('id', {
			description: 'The ID of the post',
		}),
		createdAt: t.expose('createdAt', {
			type: 'DateTime',
			description: 'The date and time the post was published',
		}),
		updatedAt: t.expose('updatedAt', {
			type: 'DateTime',
			nullable: true,
			description: 'The date and time the post was last updated',
		}),
		publishedAt: t.field({
			type: 'DateTime',
			description: 'The last time the post was republished',
			resolve: (source) => source.updatedAt ?? source.createdAt,
		}),
		publishedBy: t.field({
			type: User,
			resolve: (source) => source.publishedBy,
			description: 'The ID of the user who published the post',
		}),
		notebookId: t.exposeID('notebookId', {
			description: 'The ID of the notebook the post belongs to',
		}),
		slug: t.exposeString('slug', {
			description: 'The slug of the post',
		}),
		title: t.exposeString('title', {
			description: 'The title of the post',
		}),
		summary: t.exposeString('summary', {
			description: 'The summary of the post',
			nullable: true,
		}),
		coverImageUrl: t.exposeString('coverImageUrl', {
			description: 'The URL of the cover image for the post',
			nullable: true,
		}),
		body: t.expose('body', {
			type: 'JSON',
			description: 'The body of the post',
		}),
		url: t.field({
			type: 'String',
			resolve: (source) => {
				return `${POST_HUB_ORIGIN}/${source.notebookId}/${source.slug}`;
			},
		}),
	}),
});

builder.objectType('PublishPostResult', {
	description: 'The result of publishing a post',
	fields: (t) => ({
		notebook: t.field({
			type: 'PublishedNotebook',
			resolve: async (source, _, ctx) => {
				const notebook = await ctx.db
					.selectFrom('PublishedNotebook')
					.selectAll()
					.where('id', '=', source.notebookId)
					.executeTakeFirstOrThrow();

				return assignTypeName('PublishedNotebook')(notebook);
			},
		}),
		post: t.field({
			type: 'PublishedPost',
			description: 'The ID of the post that was published',
			resolve: async (source, _, ctx) => {
				const post = await ctx.db
					.selectFrom('PublishedPost')
					.selectAll()
					.where('id', '=', source.postId)
					.executeTakeFirstOrThrow();

				return assignTypeName('PublishedPost')(post);
			},
		}),
	}),
});

builder.inputType('PublishPostInput', {
	fields: (t) => ({
		post: t.field({
			type: 'PublishPostPostInput',
			required: true,
		}),
		notebook: t.field({
			type: 'PublishPostNotebookInput',
			required: true,
		}),
	}),
});

builder.inputType('PublishPostPostInput', {
	fields: (t) => ({
		id: t.id({
			description: 'The ID of the post to publish',
			required: true,
		}),
		slug: t.string({
			description: 'The slug of the post',
			required: true,
		}),
		title: t.string({
			description: 'The title of the post',
			required: true,
		}),
		coverImageId: t.string({
			description: 'The URL of the cover image for the post',
			required: false,
		}),
		summary: t.string({
			description: 'The summary of the post',
			required: false,
		}),
		body: t.field({
			type: 'JSON',
			description: 'The body of the post',
			required: true,
		}),
	}),
});

builder.inputType('PublishPostNotebookInput', {
	fields: (t) => ({
		id: t.id({
			description: 'The ID of the notebook to publish',
			required: true,
		}),
		name: t.string({
			description: 'The name of the notebook',
			required: true,
		}),
		coverImageId: t.string({
			description: 'The URL of the cover image for the notebook',
			required: false,
		}),
		iconId: t.string({
			description: 'The URL of the icon for the notebook',
			required: false,
		}),
		description: t.field({
			type: 'JSON',
			description: 'The description of the notebook',
			required: false,
		}),
		theme: t.field({
			type: 'PublishPostNotebookThemeInput',
			description: 'The theme of the notebook',
			required: false,
		}),
	}),
});

builder.inputType('PublishPostNotebookThemeInput', {
	fields: (t) => ({
		primaryColor: t.string({
			description: 'The primary color of the notebook',
			required: true,
		}),
		fontStyle: t.string({
			description: 'The font style of the notebook and posts',
			required: true,
		}),
		spacing: t.string({
			description: 'Overall spacing scale',
			required: true,
		}),
		corners: t.string({
			description: 'Corner radiuses',
			required: false,
		}),
	}),
});

const baseRichTextNodeSchema = z.object({
	type: z.string(),
	attrs: z.record(z.any()).nullable().optional(),
	start: z.number().nullable().optional(),
	end: z.number().nullable().optional(),
	text: z.string().nullable().optional(),
});
type RichTextNode = z.infer<typeof baseRichTextNodeSchema> & {
	content?: RichTextNode[] | null;
	marks?: RichTextNode[] | null;
};
const richTextNodeSchema: z.ZodType<RichTextNode> =
	baseRichTextNodeSchema.extend({
		content: z
			.lazy(() => richTextNodeSchema.array())
			.nullable()
			.optional(),
		marks: z
			.lazy(() => richTextNodeSchema.array())
			.nullable()
			.optional(),
	});
const notebookThemeSchema = z.object({
	primaryColor: z.string(),
	fontStyle: z.enum(['serif', 'sans-serif']),
	spacing: z.enum(['sm', 'md', 'lg']),
	corners: z
		.enum(['rounded', 'square'])
		.nullable()
		.optional()
		.transform((val) => val ?? 'rounded'),
});
