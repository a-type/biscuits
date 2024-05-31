/** Generated types for Verdant client */
import type {
  Client as BaseClient,
  ClientDescriptor as BaseClientDescriptor,
  ClientDescriptorOptions as BaseClientDescriptorOptions,
  CollectionQueries,
  StorageSchema,
  Migration,
} from "@verdant-web/store";
export * from "@verdant-web/store";

export class Client<Presence = any, Profile = any> {
  readonly projects: CollectionQueries<Project, ProjectInit, ProjectFilter>;
  readonly tasks: CollectionQueries<Task, TaskInit, TaskFilter>;
  readonly connections: CollectionQueries<
    Connection,
    ConnectionInit,
    ConnectionFilter
  >;

  sync: BaseClient<Presence, Profile>["sync"];
  undoHistory: BaseClient<Presence, Profile>["undoHistory"];
  namespace: BaseClient<Presence, Profile>["namespace"];
  entities: BaseClient<Presence, Profile>["entities"];
  // queryStore: BaseClient<Presence, Profile>['queryStore'];
  batch: BaseClient<Presence, Profile>["batch"];
  // files: BaseClient<Presence, Profile>['files'];
  close: BaseClient<Presence, Profile>["close"];
  export: BaseClient<Presence, Profile>["export"];
  import: BaseClient<Presence, Profile>["import"];
  subscribe: BaseClient<Presence, Profile>["subscribe"];
  stats: BaseClient<Presence, Profile>["stats"];
  __dangerous__resetLocal: BaseClient<
    Presence,
    Profile
  >["__dangerous__resetLocal"];
}

export interface ClientDescriptorOptions<Presence = any, Profile = any>
  extends Omit<
    BaseClientDescriptorOptions<Presence, Profile>,
    "schema" | "migrations"
  > {
  /** WARNING: overriding the schema is dangerous and almost definitely not what you want. */
  schema?: StorageSchema;
  /** WARNING: overriding the migrations is dangerous and almost definitely not what you want. */
  migrations?: Migration[];
}

export class ClientDescriptor<Presence = any, Profile = any> {
  constructor(init: ClientDescriptorOptions<Presence, Profile>);
  open: () => Promise<Client<Presence, Profile>>;
  close: () => Promise<void>;
  readonly current: Client<Presence, Profile> | null;
  readonly readyPromise: Promise<Client<Presence, Profile>>;
  readonly schema: StorageSchema;
  readonly namespace: string;
  /**
   * Resets all local data for this client, including the schema and migrations.
   * If the client is not connected to sync, this causes the irretrievable loss of all data.
   * If the client is connected to sync, this will cause the client to re-sync all data from the server.
   * Use this very carefully, and only as a last resort.
   */
  __dangerous__resetLocal: () => Promise<void>;
}

import {
  ObjectEntity,
  ListEntity,
  EntityFile,
  EntityFileSnapshot,
} from "@verdant-web/store";

/** Generated types for Project */

export type Project = ObjectEntity<
  ProjectInit,
  ProjectDestructured,
  ProjectSnapshot
>;
export type ProjectId = string;
export type ProjectName = string;
export type ProjectCreatedAt = number;
export type ProjectInit = { id?: string; name: string; createdAt?: number };

export type ProjectDestructured = {
  id: string;
  name: string;
  createdAt: number;
};

export type ProjectSnapshot = { id: string; name: string; createdAt: number };

/** Index filters for Project **/

export interface ProjectCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface ProjectCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface ProjectCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type ProjectFilter =
  | ProjectCreatedAtSortFilter
  | ProjectCreatedAtMatchFilter
  | ProjectCreatedAtRangeFilter;

/** Generated types for Task */

export type Task = ObjectEntity<TaskInit, TaskDestructured, TaskSnapshot>;
export type TaskId = string;
export type TaskProjectId = string;
export type TaskCreatedAt = number;
export type TaskContent = string;
export type TaskCompletedAt = number;
export type TaskPosition = ObjectEntity<
  TaskPositionInit,
  TaskPositionDestructured,
  TaskPositionSnapshot
>;
export type TaskPositionX = number;
export type TaskPositionY = number;
export type TaskInit = {
  id?: string;
  projectId: string;
  createdAt?: number;
  content: string;
  completedAt?: number | null;
  position: TaskPositionInit;
};

export type TaskPositionInit = { x: number; y: number };
export type TaskDestructured = {
  id: string;
  projectId: string;
  createdAt: number;
  content: string;
  completedAt: number | null;
  position: TaskPosition;
};

export type TaskPositionDestructured = { x: number; y: number };
export type TaskSnapshot = {
  id: string;
  projectId: string;
  createdAt: number;
  content: string;
  completedAt: number | null;
  position: TaskPositionSnapshot;
};

export type TaskPositionSnapshot = { x: number; y: number };

/** Index filters for Task **/

export interface TaskProjectIdSortFilter {
  where: "projectId";
  order: "asc" | "desc";
}
export interface TaskProjectIdMatchFilter {
  where: "projectId";
  equals: string;
  order?: "asc" | "desc";
}
export interface TaskProjectIdRangeFilter {
  where: "projectId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface TaskProjectIdStartsWithFilter {
  where: "projectId";
  startsWith: string;
  order?: "asc" | "desc";
}
export type TaskFilter =
  | TaskProjectIdSortFilter
  | TaskProjectIdMatchFilter
  | TaskProjectIdRangeFilter
  | TaskProjectIdStartsWithFilter;

/** Generated types for Connection */

export type Connection = ObjectEntity<
  ConnectionInit,
  ConnectionDestructured,
  ConnectionSnapshot
>;
export type ConnectionId = string;
export type ConnectionCreatedAt = number;
export type ConnectionSourceTaskId = string;
export type ConnectionTargetTaskId = string;
export type ConnectionInit = {
  id?: string;
  createdAt?: number;
  sourceTaskId: string;
  targetTaskId: string;
};

export type ConnectionDestructured = {
  id: string;
  createdAt: number;
  sourceTaskId: string;
  targetTaskId: string;
};

export type ConnectionSnapshot = {
  id: string;
  createdAt: number;
  sourceTaskId: string;
  targetTaskId: string;
};

/** Index filters for Connection **/

export interface ConnectionSourceTaskIdSortFilter {
  where: "sourceTaskId";
  order: "asc" | "desc";
}
export interface ConnectionSourceTaskIdMatchFilter {
  where: "sourceTaskId";
  equals: string;
  order?: "asc" | "desc";
}
export interface ConnectionSourceTaskIdRangeFilter {
  where: "sourceTaskId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ConnectionSourceTaskIdStartsWithFilter {
  where: "sourceTaskId";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface ConnectionTargetTaskIdSortFilter {
  where: "targetTaskId";
  order: "asc" | "desc";
}
export interface ConnectionTargetTaskIdMatchFilter {
  where: "targetTaskId";
  equals: string;
  order?: "asc" | "desc";
}
export interface ConnectionTargetTaskIdRangeFilter {
  where: "targetTaskId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ConnectionTargetTaskIdStartsWithFilter {
  where: "targetTaskId";
  startsWith: string;
  order?: "asc" | "desc";
}
export type ConnectionFilter =
  | ConnectionSourceTaskIdSortFilter
  | ConnectionSourceTaskIdMatchFilter
  | ConnectionSourceTaskIdRangeFilter
  | ConnectionSourceTaskIdStartsWithFilter
  | ConnectionTargetTaskIdSortFilter
  | ConnectionTargetTaskIdMatchFilter
  | ConnectionTargetTaskIdRangeFilter
  | ConnectionTargetTaskIdStartsWithFilter;
