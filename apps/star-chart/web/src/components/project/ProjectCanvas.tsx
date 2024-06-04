import { hooks } from '@/store.js';
import { Project, Task } from '@star-chart.biscuits/verdant';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { BoxSelect } from '../canvas/BoxSelect.jsx';
import {
  CanvasGestures,
  CanvasProvider,
  useCanvas,
} from '../canvas/CanvasProvider.jsx';
import { CanvasRenderer } from '../canvas/CanvasRenderer.jsx';
import { CanvasSvgLayer } from '../canvas/CanvasSvgLayer.jsx';
import { CanvasWallpaper } from '../canvas/CanvasWallpaper.jsx';
import { snapVector } from '../canvas/math.js';
import { Minimap } from '../canvas/Minimap.jsx';
import { Vector2 } from '../canvas/types.js';
import {
  useViewport,
  ViewportProvider,
  ViewportRoot,
} from '../canvas/ViewportProvider.jsx';
import { AnalysisContext } from './AnalysisContext.jsx';
import { ArrowMarkers } from './ArrowMarkers.jsx';
import { CameraControls } from './CameraControls.jsx';
import { ConnectionWire } from './ConnectionWire.jsx';
import { useProjectData } from './hooks.js';
import { TaskNode } from './TaskNode.jsx';
import { SelectionMenu } from './SelectionMenu.jsx';
import { Reticule } from './Reticule.jsx';
import { ProjectTitle } from './ProjectTitle.jsx';
import { HomeButton } from './HomeButton.jsx';

export interface ProjectCanvasProps {
  project: Project;
}

export function ProjectCanvas({ project }: ProjectCanvasProps) {
  const projectId = project.get('id');

  const { tasks, connections, analysis } = useProjectData(projectId);

  const addTask = useAddTask(projectId);

  return (
    <AnalysisContext.Provider value={analysis}>
      <ViewportProvider minZoom={0.25} maxZoom={1.25}>
        <ZoomFitter tasks={tasks} />
        <CanvasProvider
          options={{
            positionSnapIncrement: 24,
          }}
        >
          <CanvasGestures
            onTap={async (position, ctx) => {
              console.log(ctx.canvas.selections.selectedIds.size);
              if (ctx.canvas.selections.selectedIds.size === 0) {
                const task = await addTask(position);
                ctx.canvas.selections.set([task.get('id')]);
              } else {
                ctx.canvas.selections.set([]);
              }
            }}
          />
          <ViewportRoot>
            <ProjectTitle project={project} />

            <CanvasRenderer>
              <CanvasWallpaper />
              <CanvasSvgLayer id="connections">
                <ArrowMarkers />
                <Reticule />
                <BoxSelect className="stroke-1 stroke-accent-dark fill-accent-wash opacity-50 z-0" />
              </CanvasSvgLayer>
              {connections.map((connection) => (
                <Suspense key={connection.get('id')}>
                  <ConnectionWire connection={connection} />
                </Suspense>
              ))}
              {tasks.map((task) => (
                <Suspense key={task.get('id')}>
                  <TaskNode task={task} />
                </Suspense>
              ))}
            </CanvasRenderer>
            <CameraControls />
            <Minimap className="hidden sm:block absolute bottom-0 left-0 w-200px border-default bg-light-blend" />
            <SelectionMenu />
            <HomeButton />
          </ViewportRoot>
        </CanvasProvider>
      </ViewportProvider>
    </AnalysisContext.Provider>
  );
}

function useAddTask(projectId: string) {
  const client = hooks.useClient();

  return useCallback(
    async (position: Vector2) => {
      const task = await client.tasks.put({
        projectId,
        content: 'New Task',
        position: snapVector(position, 24),
      });
      return task;
    },
    [client],
  );
}

function useZoomToFit(tasks: Task[]) {
  const viewport = useViewport();
  const [hasZoomed, setHasZoomed] = useState(false);
  useEffect(() => {
    if (hasZoomed) return;
    if (tasks.length === 0) return;
    const bounds = tasks.reduce(
      (acc, task) => {
        const position = task.get('position').getAll();
        return {
          left: Math.min(acc.left, position.x),
          top: Math.min(acc.top, position.y),
          right: Math.max(acc.right, position.x),
          bottom: Math.max(acc.bottom, position.y),
        };
      },
      {
        left: Infinity,
        top: Infinity,
        right: -Infinity,
        bottom: -Infinity,
      },
    );
    const center = {
      x: (bounds.left + bounds.right) / 2,
      y: (bounds.top + bounds.bottom) / 2,
    };
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const padding = 100;
    const zoom = Math.min(
      viewport.elementSize.width / (width + padding),
      viewport.elementSize.height / (height + padding),
    );
    // this ensures the move happens after other
    // effects that ran on the same render. mainly
    // the canvas viewport setup stuff...
    requestAnimationFrame(() => {
      viewport.doMove(center, zoom);
    });
    setHasZoomed(true);
  }, [tasks, viewport, hasZoomed]);
}

function ZoomFitter({ tasks }: { tasks: Task[] }) {
  useZoomToFit(tasks);
  return null;
}
