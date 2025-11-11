/** Generated types for Verdant client */
import type {
  Client as BaseClient,
  ClientInitOptions as BaseClientInitOptions,
  CollectionQueries,
  StorageSchema,
  Migration,
} from "@verdant-web/store";
export * from "@verdant-web/store";

export class Client<Presence = any, Profile = any> {
  /** Collection access for Project. Load queries, put and delete documents. */
  readonly projects: CollectionQueries<Project, ProjectInit, ProjectFilter>;

  /** Collection access for Task. Load queries, put and delete documents. */
  readonly tasks: CollectionQueries<Task, TaskInit, TaskFilter>;

  /** Collection access for Connection. Load queries, put and delete documents. */
  readonly connections: CollectionQueries<
    Connection,
    ConnectionInit,
    ConnectionFilter
  >;

  /**
   * Turn on and off sync, or adjust the sync protocol and other settings.
   */
  sync: BaseClient<Presence, Profile>["sync"];
  /**
   * Access and manipulate the undo/redo stack. You can also
   * add custom undoable actions using addUndo, although the interface
   * for doing this is pretty mind-bending at the moment (sorry).
   */
  undoHistory: BaseClient<Presence, Profile>["undoHistory"];
  /**
   * The namespace used to construct this store.
   */
  namespace: BaseClient<Presence, Profile>["namespace"];
  /**
   * @deprecated - do not use this. For batching, use .batch instead.
   * Using methods on this property can cause data loss and corruption.
   */
  entities: BaseClient<Presence, Profile>["entities"];
  /**
   * Tools for batching operations so they are bundled together
   * in the undo/redo stack.
   */
  batch: BaseClient<Presence, Profile>["batch"];
  close: BaseClient<Presence, Profile>["close"];
  /**
   * Export a backup of a full library
   */
  export: BaseClient<Presence, Profile>["export"];
  /**
   * Import a full library from a backup. WARNING: this replaces
   * existing data with no option for restore.
   */
  import: BaseClient<Presence, Profile>["import"];
  /**
   * Subscribe to global store events
   */
  subscribe: BaseClient<Presence, Profile>["subscribe"];
  /**
   * Read stats about storage usage
   */
  stats: BaseClient<Presence, Profile>["stats"];
  /**
   * An interface for inspecting and manipulating active live queries.
   * Particularly, see .keepAlive and .dropKeepAlive for placing keep-alive
   * holds to keep query results in memory when unsubscribed.
   */
  queries: BaseClient<Presence, Profile>["queries"];

  /**
   * Get the local replica ID for this client instance.
   * Not generally useful for people besides me.
   */
  getReplicaId: BaseClient<Presence, Profile>["getReplicaId"];

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
   * would be __dangerous__resetLocal on Client, which
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

  constructor(init: ClientInitOptions<Presence, Profile>);
}

export interface ClientInitOptions<Presence = any, Profile = any>
  extends Omit<
    BaseClientInitOptions<Presence, Profile>,
    "schema" | "migrations" | "oldSchemas"
  > {
  /** WARNING: overriding the schema is dangerous and almost definitely not what you want. */
  schema?: StorageSchema;
  /** WARNING: overriding old schemas is dangerous and almost definitely not what you want. */
  oldSchemas?: StorageSchema[];
  /** WARNING: overriding the migrations is dangerous and almost definitely not what you want. */
  migrations?: Migration[];
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
export type TaskImages = ListEntity<
  TaskImagesInit,
  TaskImagesDestructured,
  TaskImagesSnapshot
>;
export type TaskImagesItem = EntityFile;
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
  position?: TaskPositionInit | null;
  images?: TaskImagesInit;
  note?: string | null;
  assignedTo?: string | null;
  timeEstimateMinutes?: number | null;
  scheduledAt?: number | null;
};

export type TaskPositionInit = { x: number; y: number };
export type TaskImagesInit = File[];
export type TaskDestructured = {
  id: string;
  projectId: string | null;
  createdAt: number;
  content: string;
  completedAt: number | null;
  position: TaskPosition | null;
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
  position: TaskPositionSnapshot | null;
  images: TaskImagesSnapshot;
  note: string | null;
  assignedTo: string | null;
  timeEstimateMinutes: number | null;
  scheduledAt: number | null;
};

export type TaskPositionSnapshot = { x: number; y: number };
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
