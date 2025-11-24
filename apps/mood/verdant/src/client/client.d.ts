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
  /** Collection access for Entry. Load queries, put and delete documents. */
  readonly entries: CollectionQueries<Entry, EntryInit, EntryFilter>;

  /** Collection access for Tag. Load queries, put and delete documents. */
  readonly tags: CollectionQueries<Tag, TagInit, TagFilter>;

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

/** Generated types for Entry */

export type Entry = ObjectEntity<EntryInit, EntryDestructured, EntrySnapshot>;
export type EntryId = string;
export type EntryCreatedAt = number;
export type EntryValue = number;
export type EntryTags = ListEntity<
  EntryTagsInit,
  EntryTagsDestructured,
  EntryTagsSnapshot
>;
export type EntryTagsItem = string;
export type EntryInit = {
  id?: string;
  createdAt?: number;
  value?: number | null;
  tags?: EntryTagsInit;
};

export type EntryTagsInit = string[];
export type EntryDestructured = {
  id: string;
  createdAt: number;
  value: number | null;
  tags: EntryTags;
};

export type EntryTagsDestructured = string[];
export type EntrySnapshot = {
  id: string;
  createdAt: number;
  value: number | null;
  tags: EntryTagsSnapshot;
};

export type EntryTagsSnapshot = string[];

/** Index filters for Entry **/

export interface EntryCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface EntryCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface EntryCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface EntryDateSortFilter {
  where: "date";
  order: "asc" | "desc";
}
export interface EntryDateMatchFilter {
  where: "date";
  equals: number;
  order?: "asc" | "desc";
}
export interface EntryDateRangeFilter {
  where: "date";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type EntryFilter =
  | EntryCreatedAtSortFilter
  | EntryCreatedAtMatchFilter
  | EntryCreatedAtRangeFilter
  | EntryDateSortFilter
  | EntryDateMatchFilter
  | EntryDateRangeFilter;

/** Generated types for Tag */

export type Tag = ObjectEntity<TagInit, TagDestructured, TagSnapshot>;
export type TagValue = string;
export type TagCreatedAt = number;
export type TagLastUsedAt = number;
export type TagUseCount = number;
export type TagInit = {
  value: string;
  createdAt?: number;
  lastUsedAt?: number;
  useCount?: number;
};

export type TagDestructured = {
  value: string;
  createdAt: number;
  lastUsedAt: number;
  useCount: number;
};

export type TagSnapshot = {
  value: string;
  createdAt: number;
  lastUsedAt: number;
  useCount: number;
};

/** Index filters for Tag **/

export interface TagUseCountSortFilter {
  where: "useCount";
  order: "asc" | "desc";
}
export interface TagUseCountMatchFilter {
  where: "useCount";
  equals: number;
  order?: "asc" | "desc";
}
export interface TagUseCountRangeFilter {
  where: "useCount";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface TagLastUsedAtSortFilter {
  where: "lastUsedAt";
  order: "asc" | "desc";
}
export interface TagLastUsedAtMatchFilter {
  where: "lastUsedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface TagLastUsedAtRangeFilter {
  where: "lastUsedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type TagFilter =
  | TagUseCountSortFilter
  | TagUseCountMatchFilter
  | TagUseCountRangeFilter
  | TagLastUsedAtSortFilter
  | TagLastUsedAtMatchFilter
  | TagLastUsedAtRangeFilter;
