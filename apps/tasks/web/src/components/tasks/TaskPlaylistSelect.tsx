import { hooks } from '@/hooks.js';
import { Box, Icon } from '@a-type/ui';
import { Task } from '@tasks.biscuits/verdant';
import { TaskAddToPlaylistMenu } from './TaskAddToPlaylistMenu.jsx';

export interface TaskPlaylistSelectProps {
	task: Task;
}

export function TaskPlaylistSelect({ task }: TaskPlaylistSelectProps) {
	const assignedPlaylists = hooks.useAllPlaylists({
		key: `playlists-for-${task.uid}`,
		index: {
			where: 'taskId',
			equals: task.uid,
		},
	});

	if (assignedPlaylists.length === 0) {
		return (
			<TaskAddToPlaylistMenu
				task={task}
				size="small"
				emphasis="ghost"
				align="start"
			/>
		);
	}

	return (
		<Box wrap items="center" gap="sm">
			<Icon name="add_to_list" />
			{assignedPlaylists.map((playlist) => (
				<span key={playlist.uid}>{playlist.get('name')}</span>
			))}
			<TaskAddToPlaylistMenu
				task={task}
				aria-label="Edit playlists"
				size="small"
				emphasis="ghost"
			>
				<Icon name="dots" />
			</TaskAddToPlaylistMenu>
		</Box>
	);
}
