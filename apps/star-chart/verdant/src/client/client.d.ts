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

  /**
   * Deletes all local data. If the client is connected to sync,
   * this will cause the client to re-sync all data from the server.
   * Use this very carefully, and only as a last resort.
   */
  __dangerous__resetLocal: BaseClient<
    Presence,
    Profile
  >["__dangerous__resetLocal"];

  /**
   * Export all data, then re-import it. This might resolve
   * some issues with the local database, but it should
   * only be done as a second-to-last resort. The last resort
   * would be __dangerous__resetLocal on ClientDescriptor, which
   * clears all local data.
   *
   * Unlike __dangerous__resetLocal, this method allows local-only
   * clients to recover data, whereas __dangerous__resetLocal only
   * lets networked clients recover from the server.
   */
  __dangerous__hardReset: () => Promise<void>;

  /**
   * Manually triggers storage rebasing. Follows normal
   * rebasing rules. Rebases already happen automatically
   * during normal operation, so you probably don't need this.
   */
  __manualRebase: () => Promise<void>;
}

export interface ClientDescriptorOptions<Presence = any, Profile = any>
  extends Omit<
    BaseClientDescriptorOptions<Presence, Profile>,
    "schema" | "migrations" | "oldSchemas"
  > {
  /** WARNING: overriding the schema is dangerous and almost definitely not what you want. */
  schema?: StorageSchema;
  /** WARNING: overriding old schemas is dangerous and almost definitely not what you want. */
  oldSchemas?: StorageSchema[];
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
> | null;
export type TaskPositionX = number;
export type TaskPositionY = number;
export type TaskImages = ListEntity<
  TaskImagesInit,
  TaskImagesDestructured,
  TaskImagesSnapshot
>;
export type TaskImagesItem = string;
export type TaskNote = string;
export type TaskAssignedTo = string;
export type TaskTimeEstimateMinutes = number;
export type TaskScheduledAt = number;
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
export type TaskDestructured = {
  id: string;
  projectId: string | null;
  createdAt: number;
  content: string;
  completedAt: number | null;
  position: TaskPosition;
  images: TaskImages;
  note: string | null;
  assignedTo: string | null;
  timeEstimateMinutes: number | null;
  scheduledAt: number | null;
};

export type TaskPositionDestructured = { x: number; y: number };
export type TaskImagesDestructured = EntityFile[];
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
export type ConnectionProjectId = string;
export type ConnectionSourceTaskId = string;
export type ConnectionTargetTaskId = string;
export type ConnectionInit = {
  id?: string;
  createdAt?: number;
  projectId: string;
  sourceTaskId: string;
  targetTaskId: string;
};

export type ConnectionDestructured = {
  id: string;
  createdAt: number;
  projectId: string;
  sourceTaskId: string;
  targetTaskId: string;
};

export type ConnectionSnapshot = {
  id: string;
  createdAt: number;
  projectId: string;
  sourceTaskId: string;
  targetTaskId: string;
};

/** Index filters for Connection **/

export interface ConnectionProjectIdSortFilter {
  where: "projectId";
  order: "asc" | "desc";
}
export interface ConnectionProjectIdMatchFilter {
  where: "projectId";
  equals: string;
  order?: "asc" | "desc";
}
export interface ConnectionProjectIdRangeFilter {
  where: "projectId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ConnectionProjectIdStartsWithFilter {
  where: "projectId";
  startsWith: string;
  order?: "asc" | "desc";
}
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
  | ConnectionProjectIdSortFilter
  | ConnectionProjectIdMatchFilter
  | ConnectionProjectIdRangeFilter
  | ConnectionProjectIdStartsWithFilter
  | ConnectionSourceTaskIdSortFilter
  | ConnectionSourceTaskIdMatchFilter
  | ConnectionSourceTaskIdRangeFilter
  | ConnectionSourceTaskIdStartsWithFilter
  | ConnectionTargetTaskIdSortFilter
  | ConnectionTargetTaskIdMatchFilter
  | ConnectionTargetTaskIdRangeFilter
  | ConnectionTargetTaskIdStartsWithFilter;
