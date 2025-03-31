import { NavBar } from '@/components/nav/NavBar.jsx';
import { NotebookDescriptionEditor } from '@/components/notebooks/NotebookDescriptionEditor.jsx';
import { NotebookDetailsEditor } from '@/components/notebooks/NotebookDetailsEditor.jsx';
import { CreatePostButton } from '@/components/posts/CreatePostButton.jsx';
import { PostsList } from '@/components/posts/PostsList.jsx';
import { Themed } from '@/components/Themed.jsx';
import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	H1,
	H3,
	Icon,
	PageContent,
	PageNav,
	PageNowPlaying,
	PageRoot,
} from '@a-type/ui';
import { Notebook } from '@post.biscuits/verdant';
import { Link, useParams } from '@verdant-web/react-router';
import { ReactNode } from 'react';

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
		<ThemedRoot notebook={notebook}>
			<PageContent>
				<Box d="col" gap container>
					<HomeButton />
					<NotebookDetailsEditor notebook={notebook} />
					<H3>Description</H3>
					<NotebookDescriptionEditor notebook={notebook} />
					<H3>Posts</H3>
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
		</ThemedRoot>
	);
};

function ThemedRoot({
	children,
	notebook,
}: {
	children?: ReactNode;
	notebook: Notebook;
}) {
	return (
		<Themed notebookId={notebook.get('id')} asChild>
			<PageRoot className={'bg-wash'}>{children}</PageRoot>
		</Themed>
	);
}

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
