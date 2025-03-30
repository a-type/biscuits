import { hooks } from '@/hooks.js';
import { getTitleSlug } from '@/utils/getTitleSlug.js';
import { Box, Button, Dialog, Icon } from '@a-type/ui';
import { CopyTextbox } from '@biscuits/client';
import {
	graphql,
	readFragment,
	useMutation,
	useSuspenseQuery,
} from '@biscuits/graphql';
import { tiptapToString } from '@post.biscuits/common';
import { Post } from '@post.biscuits/verdant';
import { Link } from '@verdant-web/react-router';

export interface PostPublishControlProps {
	post: Post;
}

const postFragment = graphql(`
	fragment PostPublishControl_post on PublishedPost {
		id
		url
		publishedAt
	}
`);

const publishPostControlQuery = graphql(
	`
		query PublishPostControl($id: ID!) {
			publishedPost(id: $id) {
				...PostPublishControl_post
			}
		}
	`,
	[postFragment],
);

const publishPostMutation = graphql(
	`
		mutation PublishPost($input: PublishPostInput!) {
			publishPost(input: $input) {
				post {
					...PostPublishControl_post
				}
			}
		}
	`,
	[postFragment],
);

export function PostPublishControl({ post }: PostPublishControlProps) {
	const { notebookId } = hooks.useWatch(post);
	const { data, refetch } = useSuspenseQuery(publishPostControlQuery, {
		variables: { id: post.get('id') },
	});

	const publishedPost =
		data?.publishedPost ? readFragment(postFragment, data.publishedPost) : null;
	const isPublished = !!publishedPost;

	const [publishMutation, { loading: publishing }] =
		useMutation(publishPostMutation);

	const client = hooks.useClient();

	const publish = async () => {
		// get notebook to include
		const notebookId = post.get('notebookId');
		if (!notebookId) {
			return;
		}

		const notebook = await client.notebooks.get(notebookId).resolved;

		if (!notebook) {
			throw new Error('Notebook not found');
		}

		const { id, title, coverImage, body, summary } = post.getSnapshot();
		const { description } = notebook.getSnapshot();
		await publishMutation({
			variables: {
				input: {
					post: {
						id,
						title,
						coverImageId: coverImage?.id,
						body,
						summary: summary || tiptapToString(body as any, 200),
						slug: getTitleSlug(title),
					},
					notebook: {
						id: notebookId,
						name: notebook.get('publishedTitle') || notebook.get('name'),
						coverImageId: notebook.get('coverImage')?.id,
						iconId: notebook.get('icon')?.id,
						description: description,
						theme: notebook.get('theme').getSnapshot(),
					},
				},
			},
		});
		refetch();
	};

	if (!notebookId) {
		return null;
	}

	return (
		<Dialog>
			<Dialog.Trigger asChild>
				<Button color="accent">
					<Icon name="globe" />
					{isPublished ? 'Published' : 'Publish'}
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Publish Post</Dialog.Title>
				{isPublished && (
					<Box surface="accent" p d="col" gap="sm" items="stretch">
						<div>
							Your post was last published to the internet on{' '}
							{new Date(publishedPost!.publishedAt).toDateString()}.
						</div>
						<CopyTextbox value={publishedPost!.url} />
					</Box>
				)}
				{!isPublished && (
					<Box d="col" gap="sm">
						<div>
							By publishing your post to the internet, you agree to abide by the{' '}
							<Link to={`https://biscuits.club/tos`} newTab>
								Terms and Conditions
							</Link>
						</div>
					</Box>
				)}
				<Dialog.Actions>
					<Dialog.Close asChild>
						<Button>Close</Button>
					</Dialog.Close>
					<Button color="primary" loading={publishing} onClick={publish}>
						{isPublished ? 'Update' : 'Publish'}
					</Button>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
