import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type ProjectSnapshot = { id: string; name: string; createdAt: number };
export type ProjectInit = { id?: string; name: string; createdAt?: number };

export type TaskSnapshot = {
  id: string;
  projectId: string | null;
  createdAt: number;
  content: string;
  completedAt: number | null;
  position: TaskPositionSnapshot;
  images: TaskImagesSnapshot;
  note: string | null;
  assignedTo: string | null;
  timeEstimateMinutes: number | null;
  scheduledAt: number | null;
};

export type TaskPositionSnapshot = { x: number; y: number } | null;
export type TaskImagesSnapshot = EntityFileSnapshot[];
export type TaskInit = {
  id?: string;
  projectId?: string | null;
  createdAt?: number;
  content: string;
  completedAt?: number | null;
  position?: TaskPositionInit;
  images?: TaskImagesInit;
  note?: string | null;
  assignedTo?: string | null;
  timeEstimateMinutes?: number | null;
  scheduledAt?: number | null;
};

export type TaskPositionInit = { x: number; y: number } | null;
export type TaskImagesInit = File[];

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
