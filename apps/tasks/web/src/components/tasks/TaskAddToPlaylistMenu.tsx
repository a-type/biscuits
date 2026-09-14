import { hooks } from '@/hooks.js';
import { Button, ButtonProps, DropdownMenu, Icon } from '@a-type/ui';
import { Playlist, Task } from '@tasks.biscuits/verdant';

export interface TaskAddToPlaylistMenuProps extends ButtonProps {
	task: Task;
}

export function TaskAddToPlaylistMenu({
	task,
	children,
	...rest
}: TaskAddToPlaylistMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenu.Trigger
				render={<Button {...rest}>{children ?? 'Add to Playlist'}</Button>}
			/>
			<DropdownMenu.Content>
				<PlaylistItems task={task} />
			</DropdownMenu.Content>
		</DropdownMenu>
	);
}

function PlaylistItems({ task }: { task: Task }) {
	const playlists = hooks.useAllPlaylists();

	return (
		<>
			{playlists.map((playlist) => (
				<PlaylistItem
					key={playlist.uid}
					playlist={playlist}
					taskId={task.uid}
				/>
			))}
		</>
	);
}

function PlaylistItem({
	playlist,
	taskId,
}: {
	playlist: Playlist;
	taskId: string;
}) {
	const { name, items } = hooks.useWatch(playlist);
	const liveItems = hooks.useWatch(items);
	const hasTask = liveItems.includes(taskId);
	return (
		<DropdownMenu.Item key={playlist.uid}>
			{name}
			{hasTask && <DropdownMenu.ItemIndicator render={<Icon name="check" />} />}
		</DropdownMenu.Item>
	);
}
