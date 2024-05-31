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
  const addTask = useAddTask(projectId);

  return (
    <ViewportProvider>
      <CanvasProvider>
        <ViewportRoot>
          <CanvasRenderer onTap={addTask}>
            <CanvasWallpaper />
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
      console.debug('Adding task at', position);
      client.tasks.put({
        projectId,
        content: 'New Task',
        position,
      });
    },
    [client],
  );
}
