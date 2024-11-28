import { hooks } from '@/store.js';
import { clsx } from '@a-type/ui';
import { MinimapRect } from '../canvas/Minimap.jsx';
import { useUpstreamCount } from './hooks.js';

function MinimapTask({ taskId }: { taskId: string }) {
	const task = hooks.useTask(taskId);
	hooks.useWatch(task);

	const { uncompleted: upstreams } = useUpstreamCount(taskId);

	return (
		<MinimapRect
			objectId={taskId}
			className={clsx({
				'fill-white': !task?.get('completedAt') && upstreams === 0,
				'fill-wash': !task?.get('completedAt') && upstreams > 0,
				'opacity-20': task?.get('completedAt'),
			})}
		/>
	);
}

export function renderMinimapItem(id: string, metadata: any) {
	if (metadata.type === 'task') {
		return <MinimapTask taskId={id} />;
	}
	return null;
}
