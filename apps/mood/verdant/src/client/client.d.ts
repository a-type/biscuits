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

  /** Collection access for TagMetadata. Load queries, put and delete documents. */
  readonly tagMetadata: CollectionQueries<
    TagMetadata,
    TagMetadataInit,
    TagMetadataFilter
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

/** Generated types for Entry */

export type Entry = ObjectEntity<EntryInit, EntryDestructured, EntrySnapshot>;
export type EntryId = string;
export type EntryCreatedAt = number;
export type EntryCreatedBy = string;
export type EntryValue = number;
export type EntryTags = ListEntity<
  EntryTagsInit,
  EntryTagsDestructured,
  EntryTagsSnapshot
>;
export type EntryTagsItem = string;
export type EntryWeather = ObjectEntity<
  EntryWeatherInit,
  EntryWeatherDestructured,
  EntryWeatherSnapshot
>;
export type EntryWeatherUnit = "F" | "C" | "K";
export type EntryWeatherHigh = number;
export type EntryWeatherLow = number;
export type EntryWeatherPrecipitationMm = number;
export type EntryInit = {
  id?: string;
  createdAt?: number;
  createdBy?: string | null;
  value?: number | null;
  tags?: EntryTagsInit;
  weather?: EntryWeatherInit | null;
};

export type EntryTagsInit = string[];
export type EntryWeatherInit = {
  unit: "F" | "C" | "K";
  high?: number | null;
  low?: number | null;
  precipitationMM?: number | null;
};
export type EntryDestructured = {
  id: string;
  createdAt: number;
  createdBy: string | null;
  value: number | null;
  tags: EntryTags;
  weather: EntryWeather | null;
};

export type EntryTagsDestructured = string[];
export type EntryWeatherDestructured = {
  unit: "F" | "C" | "K";
  high: number | null;
  low: number | null;
  precipitationMM: number | null;
};
export type EntrySnapshot = {
  id: string;
  createdAt: number;
  createdBy: string | null;
  value: number | null;
  tags: EntryTagsSnapshot;
  weather: EntryWeatherSnapshot | null;
};

export type EntryTagsSnapshot = string[];
export type EntryWeatherSnapshot = {
  unit: "F" | "C" | "K";
  high: number | null;
  low: number | null;
  precipitationMM: number | null;
};

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
export interface EntryWeekdaySortFilter {
  where: "weekday";
  order: "asc" | "desc";
}
export interface EntryWeekdayMatchFilter {
  where: "weekday";
  equals: number;
  order?: "asc" | "desc";
}
export interface EntryWeekdayRangeFilter {
  where: "weekday";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface EntryCreatedByDateCompoundFilter {
  where: "createdBy_date";
  match: {
    createdBy: string | null;
    date?: number;
  };
  order?: "asc" | "desc";
}
export type EntryFilter =
  | EntryCreatedAtSortFilter
  | EntryCreatedAtMatchFilter
  | EntryCreatedAtRangeFilter
  | EntryDateSortFilter
  | EntryDateMatchFilter
  | EntryDateRangeFilter
  | EntryWeekdaySortFilter
  | EntryWeekdayMatchFilter
  | EntryWeekdayRangeFilter
  | EntryCreatedByDateCompoundFilter;

/** Generated types for TagMetadata */

export type TagMetadata = ObjectEntity<
  TagMetadataInit,
  TagMetadataDestructured,
  TagMetadataSnapshot
>;
export type TagMetadataId = string;
export type TagMetadataValue = string;
export type TagMetadataCreatedAt = number;
export type TagMetadataLastUsedAt = number;
export type TagMetadataUseCount = number;
export type TagMetadataColor = string;
export type TagMetadataInit = {
  id?: string;
  value: string;
  createdAt?: number;
  lastUsedAt?: number;
  useCount?: number;
  color?: string | null;
};

export type TagMetadataDestructured = {
  id: string;
  value: string;
  createdAt: number;
  lastUsedAt: number;
  useCount: number;
  color: string | null;
};

export type TagMetadataSnapshot = {
  id: string;
  value: string;
  createdAt: number;
  lastUsedAt: number;
  useCount: number;
  color: string | null;
};

/** Index filters for TagMetadata **/

export interface TagMetadataValueSortFilter {
  where: "value";
  order: "asc" | "desc";
}
export interface TagMetadataValueMatchFilter {
  where: "value";
  equals: string;
  order?: "asc" | "desc";
}
export interface TagMetadataValueRangeFilter {
  where: "value";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface TagMetadataValueStartsWithFilter {
  where: "value";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface TagMetadataUseCountSortFilter {
  where: "useCount";
  order: "asc" | "desc";
}
export interface TagMetadataUseCountMatchFilter {
  where: "useCount";
  equals: number;
  order?: "asc" | "desc";
}
export interface TagMetadataUseCountRangeFilter {
  where: "useCount";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface TagMetadataLastUsedAtSortFilter {
  where: "lastUsedAt";
  order: "asc" | "desc";
}
export interface TagMetadataLastUsedAtMatchFilter {
  where: "lastUsedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface TagMetadataLastUsedAtRangeFilter {
  where: "lastUsedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type TagMetadataFilter =
  | TagMetadataValueSortFilter
  | TagMetadataValueMatchFilter
  | TagMetadataValueRangeFilter
  | TagMetadataValueStartsWithFilter
  | TagMetadataUseCountSortFilter
  | TagMetadataUseCountMatchFilter
  | TagMetadataUseCountRangeFilter
  | TagMetadataLastUsedAtSortFilter
  | TagMetadataLastUsedAtMatchFilter
  | TagMetadataLastUsedAtRangeFilter;
