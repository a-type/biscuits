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
  /** Collection access for Floor. Load queries, put and delete documents. */
  readonly floors: CollectionQueries<Floor, FloorInit, FloorFilter>;

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

/** Generated types for Floor */

export type Floor = ObjectEntity<FloorInit, FloorDestructured, FloorSnapshot>;
export type FloorId = string;
export type FloorCreatedAt = number;
export type FloorName = string;
export type FloorLines = ListEntity<
  FloorLinesInit,
  FloorLinesDestructured,
  FloorLinesSnapshot
>;
export type FloorLinesItem = ObjectEntity<
  FloorLinesItemInit,
  FloorLinesItemDestructured,
  FloorLinesItemSnapshot
>;
export type FloorLinesItemId = string;
export type FloorLinesItemStart = ObjectEntity<
  FloorLinesItemStartInit,
  FloorLinesItemStartDestructured,
  FloorLinesItemStartSnapshot
>;
export type FloorLinesItemStartX = number;
export type FloorLinesItemStartY = number;
export type FloorLinesItemEnd = ObjectEntity<
  FloorLinesItemEndInit,
  FloorLinesItemEndDestructured,
  FloorLinesItemEndSnapshot
>;
export type FloorLinesItemEndX = number;
export type FloorLinesItemEndY = number;
export type FloorLabels = ListEntity<
  FloorLabelsInit,
  FloorLabelsDestructured,
  FloorLabelsSnapshot
>;
export type FloorLabelsItem = ObjectEntity<
  FloorLabelsItemInit,
  FloorLabelsItemDestructured,
  FloorLabelsItemSnapshot
>;
export type FloorLabelsItemId = string;
export type FloorLabelsItemPosition = ObjectEntity<
  FloorLabelsItemPositionInit,
  FloorLabelsItemPositionDestructured,
  FloorLabelsItemPositionSnapshot
>;
export type FloorLabelsItemPositionX = number;
export type FloorLabelsItemPositionY = number;
export type FloorLabelsItemContent = string;
export type FloorInit = {
  id?: string;
  createdAt?: number;
  name: string;
  lines?: FloorLinesInit;
  labels?: FloorLabelsInit;
};

export type FloorLinesItemStartInit = { x: number; y: number };
export type FloorLinesItemEndInit = { x: number; y: number };
export type FloorLinesItemInit = {
  id?: string;
  start: FloorLinesItemStartInit;
  end: FloorLinesItemEndInit;
};
export type FloorLinesInit = FloorLinesItemInit[];
export type FloorLabelsItemPositionInit = { x: number; y: number };
export type FloorLabelsItemInit = {
  id?: string;
  position: FloorLabelsItemPositionInit;
  content: string;
};
export type FloorLabelsInit = FloorLabelsItemInit[];
export type FloorDestructured = {
  id: string;
  createdAt: number;
  name: string;
  lines: FloorLines;
  labels: FloorLabels;
};

export type FloorLinesItemStartDestructured = { x: number; y: number };
export type FloorLinesItemEndDestructured = { x: number; y: number };
export type FloorLinesItemDestructured = {
  id: string;
  start: FloorLinesItemStart;
  end: FloorLinesItemEnd;
};
export type FloorLinesDestructured = FloorLinesItem[];
export type FloorLabelsItemPositionDestructured = { x: number; y: number };
export type FloorLabelsItemDestructured = {
  id: string;
  position: FloorLabelsItemPosition;
  content: string;
};
export type FloorLabelsDestructured = FloorLabelsItem[];
export type FloorSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  lines: FloorLinesSnapshot;
  labels: FloorLabelsSnapshot;
};

export type FloorLinesItemStartSnapshot = { x: number; y: number };
export type FloorLinesItemEndSnapshot = { x: number; y: number };
export type FloorLinesItemSnapshot = {
  id: string;
  start: FloorLinesItemStartSnapshot;
  end: FloorLinesItemEndSnapshot;
};
export type FloorLinesSnapshot = FloorLinesItemSnapshot[];
export type FloorLabelsItemPositionSnapshot = { x: number; y: number };
export type FloorLabelsItemSnapshot = {
  id: string;
  position: FloorLabelsItemPositionSnapshot;
  content: string;
};
export type FloorLabelsSnapshot = FloorLabelsItemSnapshot[];

/** Index filters for Floor **/

export interface FloorCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface FloorCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface FloorCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type FloorFilter =
  | FloorCreatedAtSortFilter
  | FloorCreatedAtMatchFilter
  | FloorCreatedAtRangeFilter;
