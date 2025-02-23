import { NotebooksList } from '@/components/notebooks/NotebookList.jsx';
import { PostsList } from '@/components/posts/PostsList.jsx';
import { H2, PageContent, PageRoot } from '@a-type/ui';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<PageRoot>
			<PageContent>
				<H2>Notebooks</H2>
				<NotebooksList />
				<H2>Unsorted posts</H2>
				<PostsList notebookId={null} />
			</PageContent>
		</PageRoot>
	);
}

export default HomePage;
