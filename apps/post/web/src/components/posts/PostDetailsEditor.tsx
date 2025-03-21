import { Box, Button, clsx, CollapsibleSimple, Icon } from '@a-type/ui';
import { Post } from '@post.biscuits/verdant';
import { useState } from 'react';
import { PostCoverImageEditor } from './PostCoverImageEditor.jsx';
import { PostSummaryEditor } from './PostSummaryEditor.jsx';
import { PostTitleEditor } from './PostTitleEditor.jsx';

export interface PostDetailsEditorProps {
	post: Post;
}

export function PostDetailsEditor({ post }: PostDetailsEditorProps) {
	const [editing, setEditing] = useState(post.get('title') === 'New Post');

	return (
		<Box
			surface="default"
			p="md"
			onClick={editing ? undefined : () => setEditing(true)}
			aria-label={editing ? undefined : 'Edit post details'}
			tabIndex={editing ? -1 : 0}
			role={editing ? undefined : 'button'}
			onKeyDown={
				editing ? undefined : (
					(ev) => {
						if (ev.key === 'Enter' || ev.key === ' ') {
							setEditing(true);
						}
					}
				)
			}
			d="col"
			gap="md"
			className={clsx(
				'layer-components:unset',
				'rounded-3xl transition-colors',
				!editing &&
					'cursor-pointer hover:(bg-gray-light) focus:outline-none focus-visible:(ring-2 ring-primary bg-gray-light)',
			)}
		>
			{!editing && (
				<Box
					className="color-gray-dark absolute -top-1 -right-1 bg-wash rounded-full py-sm px-lg"
					gap
					items="center"
					onClick={() => setEditing(true)}
				>
					<Icon name="pencil" />
					Edit
				</Box>
			)}
			<PostCoverImageEditor post={post} readonly={!editing} />
			<PostTitleEditor post={post} readonly={!editing} />
			<PostSummaryEditor post={post} readonly={!editing} />
			<CollapsibleSimple open={editing}>
				<Box d="row" gap="sm" justify="end" p="sm">
					{editing && (
						<Button color="primary" onClick={() => setEditing(false)}>
							<Icon name="check" />
							Done
						</Button>
					)}
				</Box>
			</CollapsibleSimple>
		</Box>
	);
}
