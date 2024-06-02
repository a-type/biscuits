import { hooks } from '@/store.js';
import { Project, Task } from '@star-chart.biscuits/verdant';
import {
  useViewport,
  ViewportProvider,
  ViewportRoot,
} from '../canvas/ViewportProvider.jsx';
import { Suspense, useCallback, useEffect, useState } from 'react';
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
import { CameraControls } from './CameraControls.jsx';
import { useProjectData } from './hooks.js';
import { AnalysisContext } from './AnalysisContext.jsx';
import { projectCanvasMachine, ProjectCanvasState } from './state.js';

export interface ProjectCanvasProps {
  project: Project;
}

export function ProjectCanvas(props: ProjectCanvasProps) {
  const addTask = useAddTask(props.project.get('id'));

  return (
    <ProjectCanvasState.Provider
      logic={projectCanvasMachine.provide({
        actions: {
          createTask: (_, ev) => addTask(ev.position),
        },
      })}
    >
      <ProjectCanvasImpl {...props} />
    </ProjectCanvasState.Provider>
  );
}

function ProjectCanvasImpl({ project }: ProjectCanvasProps) {
  const projectId = project.get('id');

  const { tasks, connections, analysis } = useProjectData(projectId);

  const actor = ProjectCanvasState.useActorRef();

  const handleTap = useCallback(
    (position: Vector2) => {
      actor.send({ type: 'tapCanvas', position });
    },
    [actor],
  );

  return (
    <AnalysisContext.Provider value={analysis}>
      <ViewportProvider minZoom={0.25} maxZoom={1.25}>
        <ZoomFitter tasks={tasks} />
        <CanvasProvider
          options={{
            positionSnapIncrement: 24,
          }}
        >
          <ViewportRoot>
            <CanvasRenderer>
              <CanvasWallpaper onTap={handleTap} />
              <CanvasSvgLayer id="connections">
                <ArrowMarkers />
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
          </ViewportRoot>
        </CanvasProvider>
      </ViewportProvider>
    </AnalysisContext.Provider>
  );
}

function useAddTask(projectId: string) {
  const client = hooks.useClient();
  return useCallback(
    (position: Vector2) => {
      console.log('creating task at', position);
      client.tasks.put({
        projectId,
        content: 'New Task',
        position: snapVector(position, 24),
      });
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
      viewport.size.width / (width + padding),
      viewport.size.height / (height + padding),
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
