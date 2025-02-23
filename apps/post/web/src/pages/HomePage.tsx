import { CreatePostButton } from '@/components/posts/CreatePostButton.jsx';
import { PostsList } from '@/components/posts/PostsList.jsx';
import { Icon, PageContent, PageNowPlaying, PageRoot } from '@a-type/ui';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<PageRoot>
			<PageContent>
				<PostsList />
				<PageNowPlaying
					unstyled
					className="flex flex-row items-center justify-center"
				>
					<CreatePostButton
						color="primary"
						className="w-48px h-48px p-0 items-center justify-center"
					>
						<Icon name="plus" className="w-20px h-20px" />
					</CreatePostButton>
				</PageNowPlaying>
			</PageContent>
		</PageRoot>
	);
}

export default HomePage;
