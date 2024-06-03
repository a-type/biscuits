import { Task } from '@star-chart.biscuits/verdant';
import { CanvasObjectRoot, useCanvasObject } from '../canvas/CanvasObject.jsx';
import { hooks } from '@/store.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CanvasObjectDragHandle,
  disableDragProps,
} from '../canvas/CanvasObjectDragHandle.jsx';
import { TaskMenu } from './TaskMenu.jsx';
import { Checkbox } from '@a-type/ui/components/checkbox';
import { ConnectionSource } from './ConnectionSource.jsx';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { CollapsibleSimple } from '@a-type/ui/components/collapsible';
import { useDownstreamCount, useUpstreamUncompletedCount } from './hooks.js';
import { clsx } from '@a-type/ui';
import { Icon } from '@a-type/ui/components/icon';
import { Tooltip } from '@a-type/ui/components/tooltip';
import { useIsPendingSelection, useIsSelected } from '../canvas/canvasHooks.js';
import { useCanvas } from '../canvas/CanvasProvider.jsx';

export interface TaskNodeProps {
  task: Task;
}

export function TaskNode({ task }: TaskNodeProps) {
  const { id, content, position, completedAt, projectId } =
    hooks.useWatch(task);
  const initialPosition = useMemo(() => position.getSnapshot(), []);

  const canvasObject = useCanvasObject({
    initialPosition,
    objectId: id,
    onDrop: position.update,
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

  const client = hooks.useClient();
  const createConnectionTo = useCallback(
    (targetTaskId: string) => {
      console.log('connecting', id, targetTaskId);
      client.connections.put({
        id: `connection-${id}-${targetTaskId}`,
        projectId,
        sourceTaskId: id,
        targetTaskId,
      });
    },
    [client, id, projectId],
  );

  const { selected, exclusive } = useIsSelected(id);
  const pendingSelect = useIsPendingSelection(id);

  const canvas = useCanvas();
  const onTap = useCallback(() => {
    canvas.selections.set([id]);
  }, [canvas, id]);

  const downstreams = useDownstreamCount(id);
  const upstreams = useUpstreamUncompletedCount(id);

  const isPriority = upstreams === 0 && downstreams > 2;

  return (
    <CanvasObjectRoot
      className={clsx(
        'layer-components:(bg-white border-solid border-2 border-gray-blend rounded-md shadow-sm)',
        isPriority && 'layer-variants:bg-primary-wash',
        upstreams > 0 && 'layer-variants:bg-wash',
        selected && 'layer-variants:border-primary',
        !selected && pendingSelect && 'layer-variants:border-primary-wash',
      )}
      canvasObject={canvasObject}
    >
      <CanvasObjectDragHandle onTap={onTap} className="p-2">
        <div className="w-240px row items-start">
          <Checkbox
            className={clsx(!completedAt && upstreams > 0 ? 'opacity-50' : '')}
            checked={!!completedAt}
            onCheckedChange={(val) => {
              if (val) task.set('completedAt', Date.now());
              else task.set('completedAt', null);
            }}
            {...disableDragProps}
          />
          {exclusive ? (
            <LiveUpdateTextField
              className="text-sm min-w-80px w-auto py-0px h-full"
              value={content}
              onChange={(v) => task.set('content', v)}
              autoSelect
              autoFocus
            />
          ) : (
            <div
              className={clsx(
                'mt-1 text-sm',
                !completedAt
                  ? upstreams === 0
                    ? 'font-bold'
                    : ''
                  : 'line-through',
              )}
            >
              {isPriority && (
                <Tooltip content="High impact!">
                  <span>🔥</span>
                </Tooltip>
              )}
              {content}
            </div>
          )}
          <ConnectionSource
            sourceTask={task}
            onConnection={createConnectionTo}
            className="ml-auto text-xs row !gap-1 py-1 px-2 rounded-full bg-accent-light flex-shrink-0"
          >
            {downstreams === 0 ? null : downstreams}
            <Icon name="arrowRight" />
          </ConnectionSource>
          {upstreams > 0 && (
            <div className="row text-xs absolute -top-3 -left-4 bg-accent-light !gap-1 text-black rounded-full px-1">
              <Icon name="arrowRight" />
              {upstreams}
            </div>
          )}
        </div>
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
