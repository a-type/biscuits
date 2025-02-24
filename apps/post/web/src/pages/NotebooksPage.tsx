import { NavBar } from '@/components/nav/NavBar.jsx';
import { NotebooksList } from '@/components/notebooks/NotebookList.jsx';
import { PageContent, PageNav, PageRoot } from '@a-type/ui';

const NotebooksPage = () => {
	return (
		<PageRoot>
			<PageContent>
				<NotebooksList />
			</PageContent>
			<PageNav>
				<NavBar />
			</PageNav>
		</PageRoot>
	);
};

export default NotebooksPage;
