import { hooks } from '@/store.js';
import { Checkbox, clsx, Icon, LiveUpdateTextField, Tooltip } from '@a-type/ui';
import { Task } from '@star-chart.biscuits/verdant';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { CanvasGestureInfo } from '../canvas/Canvas.js';
import { useIsPendingSelection, useIsSelected } from '../canvas/canvasHooks.js';
import { CanvasObjectRoot, useCanvasObject } from '../canvas/CanvasObject.jsx';
import {
	CanvasObjectDragHandle,
	disableDragProps,
} from '../canvas/CanvasObjectDragHandle.jsx';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { Vector2 } from '../canvas/types.js';
import { ConnectionSource } from './ConnectionSource.jsx';
import { CARD_MIN_HEIGHT, CARD_WIDTH } from './constants.js';
import { useDownstreamCount, useUpstreamCount } from './hooks.js';
import { projectState } from './state.js';
import { TaskMenu } from './TaskMenu.jsx';

export interface TaskNodeProps {
	task: Task;
}

const style = {
	width: CARD_WIDTH,
	minHeight: CARD_MIN_HEIGHT,
};

export function TaskNode({ task }: TaskNodeProps) {
	const { id, position, completedAt } = hooks.useWatch(task);
	const initialPosition = useMemo(() => position.getSnapshot(), []);

	const client = hooks.useClient();
	const updatePosition = useCallback(
		(vec: Vector2) => {
			client
				.batch({ batchName: 'task-move', timeout: 40, max: 100 })
				.run(() => {
					position.update(vec);
				});
		},
		[position, client],
	);

	const canvasObject = useCanvasObject({
		initialPosition,
		objectId: id,
		onDrop: updatePosition,
		onDrag: updatePosition,
		metadata: { type: 'task' },
	});

	useEffect(() => {
		return position.subscribe('change', () => {
			const pos = position.getSnapshot();
			// TODO: fix Verdant firing change for deleted objects
			if (!pos) return;
			canvasObject.moveTo(pos);
		});
	}, [position, canvasObject]);

	const { selected, exclusive } = useIsSelected(id);
	const pendingSelect = useIsPendingSelection(id);

	const canvas = useCanvas();
	const onTap = useCallback(
		(info: CanvasGestureInfo) => {
			if (info.shift) {
				canvas.selections.add(id);
			} else {
				canvas.selections.set([id]);
			}
		},
		[canvas, id],
	);

	const { total: downstreams, uncompleted: downstreamUncompleted } =
		useDownstreamCount(id);
	const { uncompleted: upstreams } = useUpstreamCount(id);

	const { activeConnectionTarget } = useSnapshot(projectState);

	return (
		<CanvasObjectRoot
			className={clsx(
				'layer-components:(bg-white border-solid border-2 border-gray-blend rounded-md shadow-sm text-sm)',
				isPriority(upstreams, downstreams) && 'layer-variants:bg-primary-wash',
				upstreams > 0 && 'layer-variants:bg-wash',
				selected && 'layer-variants:border-primary',
				!selected && pendingSelect && 'layer-variants:border-primary-light',
				!!completedAt &&
					(downstreamUncompleted ?
						'opacity-[var(--zoom,1)]'
					:	'opacity-[calc(var(--zoom,1)*var(--zoom,1))] sm:opacity-[calc(var(--zoom,1)*var(--zoom,1)*0.5)]'),
				activeConnectionTarget === id && 'bg-accent-light border-accent',
			)}
			style={style}
			canvasObject={canvasObject}
			onTap={onTap}
		>
			<CanvasObjectDragHandle className="flex-col items-stretch justify-stretch">
				<TaskFullContent
					task={task}
					upstreams={upstreams}
					downstreams={downstreams}
				/>
				{exclusive && (
					<TaskMenu
						task={task}
						className="ml-auto absolute top-100% right-0 transform bg-white row p-1 rounded-full shadow-sm"
						{...disableDragProps}
					/>
				)}
			</CanvasObjectDragHandle>
		</CanvasObjectRoot>
	);
}

function isPriority(upstreams: number, downstreams: number) {
	return upstreams === 0 && downstreams > 2;
}

function TaskFullContent({
	task,
	upstreams,
	downstreams,
}: {
	task: Task;
	upstreams: number;
	downstreams: number;
}) {
	const { completedAt, content, projectId, id } = hooks.useWatch(task);
	const { exclusive } = useIsSelected(id);

	const client = hooks.useClient();
	const createConnectionTo = useCallback(
		(targetTaskId: string) => {
			client.connections.put({
				id: `connection-${id}-${targetTaskId}`,
				projectId,
				sourceTaskId: id,
				targetTaskId,
			});
		},
		[client, id, projectId],
	);

	const canvas = useCanvas();
	const commitAndEndEditing = () => {
		canvas.selections.remove(id);
	};

	return (
		<div className="row items-start p-2">
			<Checkbox
				className={clsx(!completedAt && upstreams > 0 ? 'opacity-50' : '')}
				checked={!!completedAt}
				onCheckedChange={(val) => {
					if (val) task.set('completedAt', Date.now());
					else task.set('completedAt', null);
				}}
				{...disableDragProps}
			/>
			{exclusive ?
				<LiveUpdateTextField
					className="text-sm min-w-80px w-auto py-0px h-full rounded-md"
					value={content}
					onChange={(v) => task.set('content', v)}
					autoSelect
					autoFocus
					textArea
					onKeyDown={(ev) => {
						if (ev.key === 'Enter') {
							ev.preventDefault();
							task.set('content', content);
							commitAndEndEditing();
						}

						const isModifiedKeypress = ev.metaKey || ev.ctrlKey;
						if (!isModifiedKeypress) {
							// capture all keypresses that aren't modified
							ev.stopPropagation();
						}
					}}
				/>
			:	<div
					className={clsx(
						'mt-1',
						!completedAt ?
							upstreams === 0 ?
								'font-bold'
							:	''
						:	'line-through',
					)}
				>
					{!completedAt && isPriority(upstreams, downstreams) && (
						<Tooltip content="High impact!">
							<span>🔥</span>
						</Tooltip>
					)}
					{content}
				</div>
			}
			<ConnectionSource
				sourceTask={task}
				onConnection={createConnectionTo}
				className="ml-auto text-xs row !gap-1 py-1 px-2 rounded-full bg-accent-light flex-shrink-0"
			>
				{downstreams === 0 ? null : downstreams}
				<Icon name="arrowRight" />
			</ConnectionSource>
			{upstreams > 0 && (
				<div className="row text-xs absolute -top-3 -left-4 bg-attention-wash !gap-1 color-black rounded-full px-2">
					<span>🚫</span>
					{upstreams}
				</div>
			)}
		</div>
	);
}
