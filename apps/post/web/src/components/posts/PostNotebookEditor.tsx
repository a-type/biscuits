import { hooks } from '@/hooks.js';
import { Post } from '@post.biscuits/verdant';
import { NotebookSelect } from '../notebooks/NotebookSelect.jsx';

export interface PostNotebookEditorProps {
	post: Post;
}

export function PostNotebookEditor({ post }: PostNotebookEditorProps) {
	const { notebookId } = hooks.useWatch(post);

	const updateNotebook = (notebookId: string | null) => {
		post.set('notebookId', notebookId);
	};

	return <NotebookSelect value={notebookId} onValueChange={updateNotebook} />;
}
