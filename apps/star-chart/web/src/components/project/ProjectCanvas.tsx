import { hooks } from '@/store.js';
import { Project } from '@star-chart.biscuits/verdant';
import { ViewportProvider, ViewportRoot } from '../canvas/ViewportProvider.jsx';
import { useCallback } from 'react';
import { CanvasProvider } from '../canvas/CanvasProvider.jsx';
import { CanvasWallpaper } from '../canvas/CanvasWallpaper.jsx';
import { CanvasRenderer } from '../canvas/CanvasRenderer.jsx';
import { Vector2 } from '../canvas/types.js';
import { CanvasObject } from '../canvas/CanvasObject.jsx';
import { TaskNode } from './TaskNode.jsx';
import { CanvasSvgLayer } from '../canvas/CanvasSvgLayer.jsx';
import { ConnectionWire } from './ConnectionWire.jsx';
import { roundVector, snapVector } from '../canvas/math.js';
import { ArrowMarkers } from './ArrowMarkers.jsx';
import { mode } from './mode.js';

export interface ProjectCanvasProps {
  project: Project;
}

export function ProjectCanvas({ project }: ProjectCanvasProps) {
  const projectId = project.get('id');
  const tasks = hooks.useAllTasks({
    index: {
      where: 'projectId',
      equals: projectId,
    },
  });
  const connections = hooks.useAllConnections({
    index: {
      where: 'projectId',
      equals: projectId,
    },
  });
  const addTask = useAddTask(projectId);
  const handleTap = useCallback(
    (position: Vector2) => {
      switch (mode.value) {
        case 'default':
          addTask(position);
          break;
        case 'edit-task':
          mode.value = 'default';
          break;
      }
    },
    [addTask],
  );

  return (
    <ViewportProvider>
      <CanvasProvider
        options={{
          positionSnapIncrement: 24,
        }}
      >
        <ViewportRoot>
          <CanvasRenderer onTap={handleTap}>
            <CanvasWallpaper />
            <CanvasSvgLayer id="connections">
              <ArrowMarkers />
              {connections.map((connection) => (
                <ConnectionWire
                  key={connection.get('id')}
                  connection={connection}
                />
              ))}
            </CanvasSvgLayer>
            {tasks.map((task) => (
              <TaskNode key={task.get('id')} task={task} />
            ))}
          </CanvasRenderer>
        </ViewportRoot>
      </CanvasProvider>
    </ViewportProvider>
  );
}

function useAddTask(projectId: string) {
  const client = hooks.useClient();
  return useCallback(
    (position: Vector2) => {
      client.tasks.put({
        projectId,
        content: 'New Task',
        position: snapVector(position, 24),
      });
    },
    [client],
  );
}
