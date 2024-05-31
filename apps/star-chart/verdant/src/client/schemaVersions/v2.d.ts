import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type ProjectSnapshot = { id: string; name: string; createdAt: number };
export type ProjectInit = { id?: string; name: string; createdAt?: number };

export type TaskSnapshot = {
  id: string;
  projectId: string;
  createdAt: number;
  content: string;
  completedAt: number | null;
  position: TaskPositionSnapshot;
};

export type TaskPositionSnapshot = { x: number; y: number };
export type TaskInit = {
  id?: string;
  projectId: string;
  createdAt?: number;
  content: string;
  completedAt?: number | null;
  position: TaskPositionInit;
};

export type TaskPositionInit = { x: number; y: number };

export type ConnectionSnapshot = {
  id: string;
  createdAt: number;
  projectId: string;
  sourceTaskId: string;
  targetTaskId: string;
};
export type ConnectionInit = {
  id?: string;
  createdAt?: number;
  projectId: string;
  sourceTaskId: string;
  targetTaskId: string;
};

export type MigrationTypes = {
  projects: { init: ProjectInit; snapshot: ProjectSnapshot };
  tasks: { init: TaskInit; snapshot: TaskSnapshot };
  connections: { init: ConnectionInit; snapshot: ConnectionSnapshot };
};
