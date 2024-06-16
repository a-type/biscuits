import { SongView } from '@/components/songs/SongView.jsx';
import { hooks } from '@/store.js';
import { PageContent } from '@a-type/ui/components/layouts';
import { useParams } from '@verdant-web/react-router';

export interface SongPageProps {}

export function SongPage({}: SongPageProps) {
  const { songId } = useParams();
  const song = hooks.useSong(songId);

  if (!song) {
    return <PageContent>Song not found</PageContent>;
  }

  return (
    <PageContent>
      <SongView song={song} />
    </PageContent>
  );
}

export default SongPage;
