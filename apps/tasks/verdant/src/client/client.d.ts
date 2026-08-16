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
  /** Collection access for Task. Load queries, put and delete documents. */
  readonly tasks: CollectionQueries<Task, TaskInit, TaskFilter>;

  /** Collection access for Playlist. Load queries, put and delete documents. */
  readonly playlists: CollectionQueries<Playlist, PlaylistInit, PlaylistFilter>;

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

/** Generated types for Task */

export type Task = ObjectEntity<TaskInit, TaskDestructured, TaskSnapshot>;
export type TaskId = string;
export type TaskTitle = string;
export type TaskDetails = string;
export type TaskCreatedAt = number;
export type TaskRecurrence = ObjectEntity<
  TaskRecurrenceInit,
  TaskRecurrenceDestructured,
  TaskRecurrenceSnapshot
>;
export type TaskRecurrenceInterval = number;
export type TaskRecurrenceUnit = "day" | "week" | "month" | "year";
export type TaskCompletions = ListEntity<
  TaskCompletionsInit,
  TaskCompletionsDestructured,
  TaskCompletionsSnapshot
>;
export type TaskCompletionsItem = ObjectEntity<
  TaskCompletionsItemInit,
  TaskCompletionsItemDestructured,
  TaskCompletionsItemSnapshot
>;
export type TaskCompletionsItemId = string;
export type TaskCompletionsItemCompletedAt = number;
export type TaskCompletionsItemCompletedBy = string;
/** The ids of tasks that this task blocks */
export type TaskBlocks = ListEntity<
  TaskBlocksInit,
  TaskBlocksDestructured,
  TaskBlocksSnapshot
>;
export type TaskBlocksItem = string;
export type TaskScale = number;
export type TaskInit = {
  id?: string;
  title?: string;
  details?: string | null;
  createdAt?: number;
  recurrence?: TaskRecurrenceInit | null;
  completions?: TaskCompletionsInit;
  blocks?: TaskBlocksInit;
  scale?: number | null;
};

export type TaskRecurrenceInit = {
  interval?: number;
  unit?: "day" | "week" | "month" | "year";
};
export type TaskCompletionsItemInit = {
  id?: string;
  completedAt?: number;
  completedBy?: string | null;
};
export type TaskCompletionsInit = TaskCompletionsItemInit[];
export type TaskBlocksInit = string[];
export type TaskDestructured = {
  id: string;
  title: string;
  details: string | null;
  createdAt: number;
  recurrence: TaskRecurrence | null;
  completions: TaskCompletions;
  blocks: TaskBlocks;
  scale: number | null;
};

export type TaskRecurrenceDestructured = {
  interval: number;
  unit: "day" | "week" | "month" | "year";
};
export type TaskCompletionsItemDestructured = {
  id: string;
  completedAt: number;
  completedBy: string | null;
};
export type TaskCompletionsDestructured = TaskCompletionsItem[];
export type TaskBlocksDestructured = string[];
export type TaskSnapshot = {
  id: string;
  title: string;
  details: string | null;
  createdAt: number;
  recurrence: TaskRecurrenceSnapshot | null;
  completions: TaskCompletionsSnapshot;
  blocks: TaskBlocksSnapshot;
  scale: number | null;
};

export type TaskRecurrenceSnapshot = {
  interval: number;
  unit: "day" | "week" | "month" | "year";
};
export type TaskCompletionsItemSnapshot = {
  id: string;
  completedAt: number;
  completedBy: string | null;
};
export type TaskCompletionsSnapshot = TaskCompletionsItemSnapshot[];
export type TaskBlocksSnapshot = string[];

/** Index filters for Task **/

export interface TaskCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface TaskCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface TaskCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface TaskSearchSortFilter {
  where: "search";
  order: "asc" | "desc";
}
export interface TaskSearchMatchFilter {
  where: "search";
  equals: string;
  order?: "asc" | "desc";
}
export interface TaskSearchRangeFilter {
  where: "search";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface TaskSearchStartsWithFilter {
  where: "search";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface TaskScaleSortFilter {
  where: "scale";
  order: "asc" | "desc";
}
export interface TaskScaleMatchFilter {
  where: "scale";
  equals: number;
  order?: "asc" | "desc";
}
export interface TaskScaleRangeFilter {
  where: "scale";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface TaskBlockCountSortFilter {
  where: "blockCount";
  order: "asc" | "desc";
}
export interface TaskBlockCountMatchFilter {
  where: "blockCount";
  equals: number;
  order?: "asc" | "desc";
}
export interface TaskBlockCountRangeFilter {
  where: "blockCount";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface TaskBlocksSortFilter {
  where: "blocks";
  order: "asc" | "desc";
}
export interface TaskBlocksMatchFilter {
  where: "blocks";
  equals: string;
  order?: "asc" | "desc";
}
export interface TaskBlocksRangeFilter {
  where: "blocks";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface TaskBlocksStartsWithFilter {
  where: "blocks";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface TaskScheduledAtSortFilter {
  where: "scheduledAt";
  order: "asc" | "desc";
}
export interface TaskScheduledAtMatchFilter {
  where: "scheduledAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface TaskScheduledAtRangeFilter {
  where: "scheduledAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type TaskFilter =
  | TaskCreatedAtSortFilter
  | TaskCreatedAtMatchFilter
  | TaskCreatedAtRangeFilter
  | TaskSearchSortFilter
  | TaskSearchMatchFilter
  | TaskSearchRangeFilter
  | TaskSearchStartsWithFilter
  | TaskScaleSortFilter
  | TaskScaleMatchFilter
  | TaskScaleRangeFilter
  | TaskBlockCountSortFilter
  | TaskBlockCountMatchFilter
  | TaskBlockCountRangeFilter
  | TaskBlocksSortFilter
  | TaskBlocksMatchFilter
  | TaskBlocksRangeFilter
  | TaskBlocksStartsWithFilter
  | TaskScheduledAtSortFilter
  | TaskScheduledAtMatchFilter
  | TaskScheduledAtRangeFilter;

/** Generated types for Playlist */

export type Playlist = ObjectEntity<
  PlaylistInit,
  PlaylistDestructured,
  PlaylistSnapshot
>;
export type PlaylistId = string;
export type PlaylistName = string;
export type PlaylistItems = ListEntity<
  PlaylistItemsInit,
  PlaylistItemsDestructured,
  PlaylistItemsSnapshot
>;
export type PlaylistItemsItem = string;
export type PlaylistInit = {
  id?: string;
  name?: string;
  items?: PlaylistItemsInit;
};

export type PlaylistItemsInit = string[];
export type PlaylistDestructured = {
  id: string;
  name: string;
  items: PlaylistItems;
};

export type PlaylistItemsDestructured = string[];
export type PlaylistSnapshot = {
  id: string;
  name: string;
  items: PlaylistItemsSnapshot;
};

export type PlaylistItemsSnapshot = string[];

/** Index filters for Playlist **/

export interface PlaylistNameSortFilter {
  where: "name";
  order: "asc" | "desc";
}
export interface PlaylistNameMatchFilter {
  where: "name";
  equals: string;
  order?: "asc" | "desc";
}
export interface PlaylistNameRangeFilter {
  where: "name";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface PlaylistNameStartsWithFilter {
  where: "name";
  startsWith: string;
  order?: "asc" | "desc";
}
export type PlaylistFilter =
  | PlaylistNameSortFilter
  | PlaylistNameMatchFilter
  | PlaylistNameRangeFilter
  | PlaylistNameStartsWithFilter;
