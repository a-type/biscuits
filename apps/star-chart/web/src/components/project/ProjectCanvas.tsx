import { hooks } from '@/store.js';
import { Project, Task } from '@star-chart.biscuits/verdant';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { BoxSelect } from '../canvas/BoxSelect.jsx';
import {
  CanvasContext,
  CanvasGestures,
  useCanvas,
  useCreateCanvas,
} from '../canvas/CanvasProvider.jsx';
import { CanvasRenderer } from '../canvas/CanvasRenderer.jsx';
import { CanvasSvgLayer } from '../canvas/CanvasSvgLayer.jsx';
import { CanvasWallpaper } from '../canvas/CanvasWallpaper.jsx';
import { addVectors, snapVector } from '../canvas/math.js';
import { Vector2 } from '../canvas/types.js';
import { useViewport, ViewportRoot } from '../canvas/ViewportRoot.jsx';
import { AnalysisContext } from './AnalysisContext.jsx';
import { ArrowMarkers } from './ArrowMarkers.jsx';
import { CameraControls } from './CameraControls.jsx';
import { ConnectionWire } from './ConnectionWire.jsx';
import { HomeButton } from './HomeButton.jsx';
import { useProjectData } from './hooks.js';
import { ProjectTitle } from './ProjectTitle.jsx';
import { Reticule } from './Reticule.jsx';
import { SelectionMenu } from './SelectionMenu.jsx';
import { TaskNode } from './TaskNode.jsx';
import { TouchTools } from './TouchTools.jsx';
import { CanvasOverlay } from '../canvas/CanvasOverlay.jsx';
import { CARD_MIN_HEIGHT, CARD_WIDTH } from './constants.js';

export interface ProjectCanvasProps {
  project: Project;
}

export function ProjectCanvas({ project }: ProjectCanvasProps) {
  const projectId = project.get('id');

  const { tasks, connections, analysis } = useProjectData(projectId);

  const addTask = useAddTask(projectId);

  const canvas = useCreateCanvas({
    viewportConfig: {
      zoomLimits: {
        max: 1.25,
        min: 0.25,
      },
      defaultCenter: { x: 0, y: 0 },
      defaultZoom: 1,
    },
    positionSnapIncrement: 24,
  });

  return (
    <CanvasContext.Provider value={canvas}>
      <AnalysisContext.Provider value={analysis}>
        <ZoomFitter tasks={tasks} />
        <CanvasGestures
          onTap={async (info) => {
            if (canvas.selections.selectedIds.size === 0) {
              const task = await addTask(
                addVectors(
                  info.worldPosition,
                  // offset to center
                  {
                    x: -CARD_WIDTH / 2,
                    y: -CARD_MIN_HEIGHT / 2,
                  },
                ),
              );
              canvas.selections.set([task.get('id')]);
            } else {
              canvas.selections.set([]);
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
          <CanvasOverlay>
            <CameraControls />
            {/* <Minimap
                className="hidden sm:block absolute bottom-0 left-0 w-200px border-default bg-light-blend"
                renderItem={renderMinimapItem}
              /> */}
            <SelectionMenu />
            <HomeButton />
            <TouchTools />
          </CanvasOverlay>
        </ViewportRoot>
      </AnalysisContext.Provider>
    </CanvasContext.Provider>
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
  const canvas = useCanvas();
  const [hasZoomed, setHasZoomed] = useState(false);
  useEffect(() => {
    if (hasZoomed) return;
    // this ensures the move happens after other
    // effects that ran on the same render. mainly
    // the canvas viewport setup stuff...
    requestAnimationFrame(() => {
      const bounds = canvas.bounds.getCurrentContainer();
      if (!bounds) return;

      canvas.viewport.fitOnScreen(bounds, { origin: 'control', margin: 10 });
    });
    setHasZoomed(true);
  }, [tasks, canvas, hasZoomed]);
}

function ZoomFitter({ tasks }: { tasks: Task[] }) {
  useZoomToFit(tasks);
  return null;
}
