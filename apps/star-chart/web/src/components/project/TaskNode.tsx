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
import { subscribe } from 'valtio';
import { mode } from './mode.js';
import { CollapsibleSimple } from '@a-type/ui/components/collapsible';
import { useDownstreamCount, useUpstreamUncompletedCount } from './hooks.js';
import { clsx } from '@a-type/ui';
import { Icon } from '@a-type/ui/components/icon';
import { Tooltip } from '@a-type/ui/components/tooltip';

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
        projectId,
        sourceTaskId: id,
        targetTaskId,
      });
    },
    [client, id, projectId],
  );

  const [editMode, setEditMode] = useState(false);
  const enterEdit = useCallback(() => {
    setEditMode(true);
    mode.value = 'edit-task';
  }, []);
  useEffect(() => {
    return subscribe(mode, () => {
      if (mode.value !== 'edit-task') {
        setEditMode(false);
      }
    });
  }, []);

  const downstreams = useDownstreamCount(id);
  const upstreams = useUpstreamUncompletedCount(id);

  const isPriority = upstreams === 0 && downstreams > 2;

  return (
    <CanvasObjectRoot
      className={clsx(
        'layer-components:(bg-white border-solid border-2 border-gray-blend p-2 rounded-md shadow-sm)',
        isPriority && 'bg-primary-wash',
        upstreams > 0 && 'bg-gray-blend',
      )}
      canvasObject={canvasObject}
    >
      <CanvasObjectDragHandle onTap={enterEdit}>
        <div className="w-max-content max-w-300px min-w-200px row items-start">
          <Checkbox
            className={clsx(!completedAt && upstreams > 0 ? 'opacity-50' : '')}
            checked={!!completedAt}
            onCheckedChange={(val) => {
              if (val) task.set('completedAt', Date.now());
              else task.set('completedAt', null);
            }}
            {...disableDragProps}
          />
          {editMode ? (
            <LiveUpdateTextField
              className="text-sm min-w-80px w-auto"
              value={content}
              onChange={(v) => task.set('content', v)}
              autoSelect
              autoFocus
            />
          ) : (
            <div
              className={clsx(
                'mt-1 text-sm',
                !completedAt ? 'font-bold' : 'line-through',
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
            sourceNodeId={id}
            onConnection={createConnectionTo}
            className="ml-auto text-xs row !gap-1 py-1 px-2 rounded-full bg-accent-light "
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
        <CollapsibleSimple open={editMode}>
          <TaskMenu task={task} className="ml-auto" {...disableDragProps} />
        </CollapsibleSimple>
      </CanvasObjectDragHandle>
    </CanvasObjectRoot>
  );
}
