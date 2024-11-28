import { CreateSongButton } from '@/components/songs/CreateSongButton.jsx';
import { SongsList } from '@/components/songs/SongsList.jsx';
import { Icon, PageContent, PageNowPlaying } from '@a-type/ui';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<PageContent>
			<SongsList />
			<PageNowPlaying unstyled className="row items-center justify-center">
				<CreateSongButton>
					<Icon name="plus" /> New Song
				</CreateSongButton>
			</PageNowPlaying>
		</PageContent>
	);
}

export default HomePage;
