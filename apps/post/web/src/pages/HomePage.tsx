import { NavBar } from '@/components/nav/NavBar.jsx';
import { PostsList } from '@/components/posts/PostsList.jsx';
import { Box, PageContent, PageNav, PageRoot } from '@a-type/ui';
import { UserMenu } from '@biscuits/client';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<PageRoot>
			<PageContent>
				<Box justify="end">
					<UserMenu />
				</Box>
				<PostsList />
			</PageContent>
			<PageNav>
				<NavBar />
			</PageNav>
		</PageRoot>
	);
}

export default HomePage;
