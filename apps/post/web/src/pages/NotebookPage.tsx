import { NotebookDetailsEditor } from '@/components/notebooks/NotebookDetailsEditor.jsx';
import { PostsList } from '@/components/posts/PostsList.jsx';
import { hooks } from '@/hooks.js';
import { Box, Button, H1, Icon, PageContent, PageRoot } from '@a-type/ui';
import { Link, useParams } from '@verdant-web/react-router';

const NotebookPage = () => {
	const { notebookId } = useParams();
	const notebook = hooks.useNotebook(notebookId);

	if (!notebook) {
		return (
			<PageRoot>
				<PageContent>
					<H1>Notebook Note Found</H1>
					<Button asChild>
						<Link to="/">Back to Home</Link>
					</Button>
				</PageContent>
			</PageRoot>
		);
	}

	return (
		<PageRoot>
			<HomeButton />
			<PageContent>
				<Box d="col" gap container>
					<NotebookDetailsEditor notebook={notebook} />
					<PostsList notebookId={notebookId} />
				</Box>
			</PageContent>
		</PageRoot>
	);
};

function HomeButton() {
	return (
		<Button
			color="default"
			size="icon"
			asChild
			className="fixed top-4 left-4 z-menu"
		>
			<Link to="/">
				<Icon name="arrowLeft" />
			</Link>
		</Button>
	);
}

export default NotebookPage;
