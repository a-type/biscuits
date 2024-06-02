import { hooks } from '@/store.js';
import { Task } from '@star-chart.biscuits/verdant';
import { useEffect, useState } from 'react';
import { useAnalysis } from './AnalysisContext.jsx';

export function useDownstreamCount(taskId: string) {
  const analysis = useAnalysis();
  return analysis.downstreams[taskId]?.length || 0;
}

export function useUpstreamUncompletedCount(taskId: string) {
  const analysis = useAnalysis();
  return (
    analysis.upstreams[taskId]?.filter((dep) => !dep.completed).length || 0
  );
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
          .map((c) => taskMap[c.get('targetTaskId')]);
        const target = connections
          .filter((c) => c.get('targetTaskId') === taskId)
          .map((c) => taskMap[c.get('sourceTaskId')]);

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
