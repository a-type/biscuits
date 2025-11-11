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
export type ProjectCreatedAt = number;
export type ProjectImage = EntityFile;
export type ProjectColors = ListEntity<
  ProjectColorsInit,
  ProjectColorsDestructured,
  ProjectColorsSnapshot
>;
export type ProjectColorsItem = ObjectEntity<
  ProjectColorsItemInit,
  ProjectColorsItemDestructured,
  ProjectColorsItemSnapshot
>;
export type ProjectColorsItemId = string;
export type ProjectColorsItemPixel = ObjectEntity<
  ProjectColorsItemPixelInit,
  ProjectColorsItemPixelDestructured,
  ProjectColorsItemPixelSnapshot
>;
export type ProjectColorsItemPixelX = number;
export type ProjectColorsItemPixelY = number;
export type ProjectColorsItemPercentage = ObjectEntity<
  ProjectColorsItemPercentageInit,
  ProjectColorsItemPercentageDestructured,
  ProjectColorsItemPercentageSnapshot
>;
export type ProjectColorsItemPercentageX = number;
export type ProjectColorsItemPercentageY = number;
export type ProjectColorsItemValue = ObjectEntity<
  ProjectColorsItemValueInit,
  ProjectColorsItemValueDestructured,
  ProjectColorsItemValueSnapshot
>;
export type ProjectColorsItemValueR = number;
export type ProjectColorsItemValueG = number;
export type ProjectColorsItemValueB = number;
export type ProjectInit = {
  id?: string;
  createdAt?: number;
  image: File;
  colors?: ProjectColorsInit;
};

export type ProjectColorsItemPixelInit = { x: number; y: number };
export type ProjectColorsItemPercentageInit = { x: number; y: number };
export type ProjectColorsItemValueInit = { r: number; g: number; b: number };
export type ProjectColorsItemInit = {
  id?: string;
  pixel: ProjectColorsItemPixelInit;
  percentage: ProjectColorsItemPercentageInit;
  value: ProjectColorsItemValueInit;
};
export type ProjectColorsInit = ProjectColorsItemInit[];
export type ProjectDestructured = {
  id: string;
  createdAt: number;
  image: EntityFile;
  colors: ProjectColors;
};

export type ProjectColorsItemPixelDestructured = { x: number; y: number };
export type ProjectColorsItemPercentageDestructured = { x: number; y: number };
export type ProjectColorsItemValueDestructured = {
  r: number;
  g: number;
  b: number;
};
export type ProjectColorsItemDestructured = {
  id: string;
  pixel: ProjectColorsItemPixel;
  percentage: ProjectColorsItemPercentage;
  value: ProjectColorsItemValue;
};
export type ProjectColorsDestructured = ProjectColorsItem[];
export type ProjectSnapshot = {
  id: string;
  createdAt: number;
  image: EntityFileSnapshot;
  colors: ProjectColorsSnapshot;
};

export type ProjectColorsItemPixelSnapshot = { x: number; y: number };
export type ProjectColorsItemPercentageSnapshot = { x: number; y: number };
export type ProjectColorsItemValueSnapshot = {
  r: number;
  g: number;
  b: number;
};
export type ProjectColorsItemSnapshot = {
  id: string;
  pixel: ProjectColorsItemPixelSnapshot;
  percentage: ProjectColorsItemPercentageSnapshot;
  value: ProjectColorsItemValueSnapshot;
};
export type ProjectColorsSnapshot = ProjectColorsItemSnapshot[];

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
