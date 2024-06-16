import { CreateSongButton } from '@/components/songs/CreateSongButton.jsx';
import { SongsList } from '@/components/songs/SongsList.jsx';
import { Icon } from '@a-type/ui/components/icon';
import { PageContent, PageNowPlaying } from '@a-type/ui/components/layouts';

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
