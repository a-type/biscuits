import { NavBar } from '@/components/nav/NavBar.jsx';
import { PostsList } from '@/components/posts/PostsList.jsx';
import { PageContent, PageNav, PageRoot } from '@a-type/ui';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<PageRoot>
			<PageContent>
				<PostsList />
			</PageContent>
			<PageNav>
				<NavBar />
			</PageNav>
		</PageRoot>
	);
}

export default HomePage;
