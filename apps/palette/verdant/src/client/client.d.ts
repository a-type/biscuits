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
export type ProjectCreatedAt = number;
export type ProjectImage = string;
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
