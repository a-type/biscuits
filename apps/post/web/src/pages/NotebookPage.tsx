import { NavBar } from '@/components/nav/NavBar.jsx';
import { NotebookDetailsEditor } from '@/components/notebooks/NotebookDetailsEditor.jsx';
import { CreatePostButton } from '@/components/posts/CreatePostButton.jsx';
import { PostsList } from '@/components/posts/PostsList.jsx';
import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	H1,
	Icon,
	PageContent,
	PageNav,
	PageNowPlaying,
	PageRoot,
} from '@a-type/ui';
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
				<PageNav>
					<NavBar />
				</PageNav>
			</PageRoot>
		);
	}

	return (
		<PageRoot>
			<PageContent>
				<Box d="col" gap container>
					<HomeButton />
					<NotebookDetailsEditor notebook={notebook} />
					<PostsList notebookId={notebookId} />
				</Box>
				<PageNowPlaying unstyled className="items-center justify-center flex">
					<CreatePostButton notebookId={notebookId} color="primary">
						<Icon name="pencil" />
						New Post
					</CreatePostButton>
				</PageNowPlaying>
			</PageContent>
			<PageNav>
				<NavBar />
			</PageNav>
		</PageRoot>
	);
};

function HomeButton() {
	return (
		<Button
			color="default"
			size="icon"
			asChild
			className="absolute top-2 left-2 z-menu"
		>
			<Link to="/">
				<Icon name="arrowLeft" />
			</Link>
		</Button>
	);
}

export default NotebookPage;
