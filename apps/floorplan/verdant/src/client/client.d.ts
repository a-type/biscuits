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

/** Generated types for Floor */

export type Floor = ObjectEntity<FloorInit, FloorDestructured, FloorSnapshot>;
export type FloorId = string;
export type FloorCreatedAt = number;
export type FloorName = string;
/** Lines represent walls. Their start and end points can snap to one another. */
export type FloorLines = ObjectEntity<
  FloorLinesInit,
  FloorLinesDestructured,
  FloorLinesSnapshot
>;
export type FloorLinesValue = ObjectEntity<
  FloorLinesValueInit,
  FloorLinesValueDestructured,
  FloorLinesValueSnapshot
>;
export type FloorLinesValueId = string;
/** Point is required, snap will override it. */
export type FloorLinesValueStart = ObjectEntity<
  FloorLinesValueStartInit,
  FloorLinesValueStartDestructured,
  FloorLinesValueStartSnapshot
>;
export type FloorLinesValueStartX = number;
export type FloorLinesValueStartY = number;
export type FloorLinesValueStartSnap = ObjectEntity<
  FloorLinesValueStartSnapInit,
  FloorLinesValueStartSnapDestructured,
  FloorLinesValueStartSnapSnapshot
>;
export type FloorLinesValueStartSnapLineId = string;
export type FloorLinesValueStartSnapSide = "start" | "end";
export type FloorLinesValueStartSnapOffset = number;
/** Shapes represent doors, walls, and furniture. They can be attached to lines or free-floating. */
export type FloorShapes = ObjectEntity<
  FloorShapesInit,
  FloorShapesDestructured,
  FloorShapesSnapshot
>;
export type FloorShapesValue = ObjectEntity<
  FloorShapesValueInit,
  FloorShapesValueDestructured,
  FloorShapesValueSnapshot
>;
export type FloorShapesValueId = string;

export type FloorShapesValueWidth = number;
export type FloorShapesValueHeight = number;
export type FloorShapesValueAngle = number;
export type FloorShapesValueType = "ellipse" | "rectangle";
/** Labels are used to add lengths, angles, or general notes. */
export type FloorLabels = ObjectEntity<
  FloorLabelsInit,
  FloorLabelsDestructured,
  FloorLabelsSnapshot
>;
export type FloorLabelsValue = ObjectEntity<
  FloorLabelsValueInit,
  FloorLabelsValueDestructured,
  FloorLabelsValueSnapshot
>;
export type FloorLabelsValueId = string;

export type FloorLabelsValueContent = string;
export type FloorInit = {
  id?: string;
  createdAt?: number;
  name: string;
  lines?: FloorLinesInit;
  shapes?: FloorShapesInit;
  labels?: FloorLabelsInit;
};

export type FloorLinesValueStartSnapInit = {
  lineId: string;
  side: "start" | "end";
  offset?: number;
};
export type FloorLinesValueStartInit = {
  x: number;
  y: number;
  snap?: FloorLinesValueStartSnapInit | null;
};
export type FloorLinesValueInit = {
  id?: string;
  start: FloorLinesValueStartInit;
  end: FloorLinesValuePropertiesInit;
};
export type FloorLinesInit = { [key: string]: FloorLinesValueInit };
export type FloorShapesValueInit = {
  id?: string;
  center: FloorLinesValuePropertiesInit;
  width: number;
  height: number;
  angle?: number;
  type?: "ellipse" | "rectangle";
};
export type FloorShapesInit = { [key: string]: FloorShapesValueInit };
export type FloorLabelsValueInit = {
  id?: string;
  center: FloorLinesValuePropertiesInit;
  content: string;
};
export type FloorLabelsInit = { [key: string]: FloorLabelsValueInit };
export type FloorDestructured = {
  id: string;
  createdAt: number;
  name: string;
  lines: FloorLines;
  shapes: FloorShapes;
  labels: FloorLabels;
};

export type FloorLinesValueStartSnapDestructured = {
  lineId: string;
  side: "start" | "end";
  offset: number;
};
export type FloorLinesValueStartDestructured = {
  x: number;
  y: number;
  snap: FloorLinesValueStartSnap | null;
};
export type FloorLinesValueDestructured = {
  id: string;
  start: FloorLinesValueStart;
  end: FloorLinesValueProperties;
};
export type FloorLinesDestructured = {
  [key: string]: FloorLinesValue | undefined;
};
export type FloorShapesValueDestructured = {
  id: string;
  center: FloorLinesValueProperties;
  width: number;
  height: number;
  angle: number;
  type: "ellipse" | "rectangle";
};
export type FloorShapesDestructured = {
  [key: string]: FloorShapesValue | undefined;
};
export type FloorLabelsValueDestructured = {
  id: string;
  center: FloorLinesValueProperties;
  content: string;
};
export type FloorLabelsDestructured = {
  [key: string]: FloorLabelsValue | undefined;
};
export type FloorSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  lines: FloorLinesSnapshot;
  shapes: FloorShapesSnapshot;
  labels: FloorLabelsSnapshot;
};

export type FloorLinesValueStartSnapSnapshot = {
  lineId: string;
  side: "start" | "end";
  offset: number;
};
export type FloorLinesValueStartSnapshot = {
  x: number;
  y: number;
  snap: FloorLinesValueStartSnapSnapshot | null;
};
export type FloorLinesValueSnapshot = {
  id: string;
  start: FloorLinesValueStartSnapshot;
  end: FloorLinesValuePropertiesSnapshot;
};
export type FloorLinesSnapshot = { [key: string]: FloorLinesValueSnapshot };
export type FloorShapesValueSnapshot = {
  id: string;
  center: FloorLinesValuePropertiesSnapshot;
  width: number;
  height: number;
  angle: number;
  type: "ellipse" | "rectangle";
};
export type FloorShapesSnapshot = { [key: string]: FloorShapesValueSnapshot };
export type FloorLabelsValueSnapshot = {
  id: string;
  center: FloorLinesValuePropertiesSnapshot;
  content: string;
};
export type FloorLabelsSnapshot = { [key: string]: FloorLabelsValueSnapshot };

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
