import { hooks } from '@/store.js';
import {
	CardGrid,
	CardMain,
	CardRoot,
	CardTitle,
	InfiniteLoadTrigger,
} from '@a-type/ui';
import { Song } from '@humding.biscuits/verdant';
import { Link } from '@verdant-web/react-router';

export interface SongsListProps {}

export function SongsList({}: SongsListProps) {
	const [songs, { hasMore, loadMore }] = hooks.useAllSongsInfinite({
		index: {
			where: 'createdAt',
			order: 'desc',
		},
		pageSize: 20,
	});

	return (
		<>
			<CardGrid>
				{songs.map((song, i) => (
					<SongsListItem song={song} key={i} />
				))}
			</CardGrid>
			{hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
		</>
	);
}

function SongsListItem({ song }: { song: Song }) {
	const { title, id } = hooks.useWatch(song);
	return (
		<CardRoot>
			<CardMain asChild>
				<Link to={`/songs/${id}`}>
					<CardTitle>{title}</CardTitle>
				</Link>
			</CardMain>
		</CardRoot>
	);
}
