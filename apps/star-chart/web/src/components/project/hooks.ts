import { hooks } from '@/store.js';
import { Task } from '@star-chart.biscuits/verdant';
import { useCallback, useEffect, useState } from 'react';
import { useAnalysis } from './AnalysisContext.jsx';
import { nonNilFilter } from '@a-type/utils';

export function useDownstreamCount(taskId: string) {
  const analysis = useAnalysis();
  const total = analysis.downstreams[taskId]?.length || 0;
  const uncompleted =
    analysis.downstreams[taskId]?.filter((dep) => !dep.completed).length || 0;
  return { total, uncompleted };
}

export function useUpstreamCount(taskId: string) {
  const analysis = useAnalysis();
  const total = analysis.upstreams[taskId]?.length || 0;
  const uncompleted =
    analysis.upstreams[taskId]?.filter((dep) => !dep.completed).length || 0;
  return { total, uncompleted };
}

export interface AnalysisDependency {
  taskId: string;
  completed: boolean;
}

export interface ProjectAnalysis {
  upstreams: Record<string, AnalysisDependency[]>;
  downstreams: Record<string, AnalysisDependency[]>;
}

export function useProjectData(projectId: string) {
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

  const [analysis, setAnalysis] = useState<ProjectAnalysis>({
    upstreams: {},
    downstreams: {},
  });

  useEffect(() => {
    // subscribe to all tasks and connections to recompute analysis
    function recompute() {
      const upstreams: Record<string, AnalysisDependency[]> = {};
      const downstreams: Record<string, AnalysisDependency[]> = {};

      const taskMap = tasks.reduce(
        (acc, task) => {
          acc[task.get('id')] = task;
          return acc;
        },
        {} as Record<string, Task>,
      );

      tasks.forEach((task) => {
        const taskId = task.get('id');
        const sourced = connections
          .filter((c) => c.get('sourceTaskId') === taskId)
          .map((c) => taskMap[c.get('targetTaskId')])
          .filter(nonNilFilter);
        const target = connections
          .filter((c) => c.get('targetTaskId') === taskId)
          .map((c) => taskMap[c.get('sourceTaskId')])
          .filter(nonNilFilter);

        upstreams[taskId] = target.map((t) => ({
          taskId: t.get('id'),
          completed: !!t.get('completedAt'),
        }));
        downstreams[taskId] = sourced.map((t) => ({
          taskId: t.get('id'),
          completed: !!t.get('completedAt'),
        }));
      });

      setAnalysis({
        upstreams,
        downstreams,
      });
    }

    recompute();

    const unsubs = [
      ...tasks.map((t) => t.subscribe('change', recompute)),
      ...connections.map((c) => c.subscribe('change', recompute)),
    ];

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [tasks, connections]);

  return {
    tasks,
    connections,
    analysis,
  };
}

export function useDeleteTask() {
  const client = hooks.useClient();
  return useCallback(
    async (id: string) => {
      const deletedIds = [id];
      // delete all connections to and from this task
      const sourcedConnections = await client.connections.findAll({
        index: {
          where: 'sourceTaskId',
          equals: id,
        },
      }).resolved;
      const targetConnections = await client.connections.findAll({
        index: {
          where: 'targetTaskId',
          equals: id,
        },
      }).resolved;
      await Promise.all([
        ...sourcedConnections.map((connection) =>
          client.connections.delete(connection.get('id')).then(() => {
            deletedIds.push(connection.get('id'));
          }),
        ),
        ...targetConnections.map((connection) =>
          client.connections.delete(connection.get('id')).then(() => {
            deletedIds.push(connection.get('id'));
          }),
        ),
        client.tasks.delete(id),
      ]);

      return deletedIds;
    },
    [client],
  );
}

export function useDeleteConnection() {
  const client = hooks.useClient();
  return useCallback(
    (id: string) => {
      return client.connections.delete(id);
    },
    [client],
  );
}
