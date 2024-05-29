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
  readonly annotations: CollectionQueries<
    Annotation,
    AnnotationInit,
    AnnotationFilter
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

/** Generated types for Annotation */

export type Annotation = ObjectEntity<
  AnnotationInit,
  AnnotationDestructured,
  AnnotationSnapshot
>;
export type AnnotationId = string;
export type AnnotationContent = string;
export type AnnotationCreatedAt = number;
export type AnnotationBook = string;
export type AnnotationStart = ObjectEntity<
  AnnotationStartInit,
  AnnotationStartDestructured,
  AnnotationStartSnapshot
>;
export type AnnotationStartChapter = number;
export type AnnotationStartVerse = number;
export type AnnotationEnd = ObjectEntity<
  AnnotationEndInit,
  AnnotationEndDestructured,
  AnnotationEndSnapshot
>;
export type AnnotationEndChapter = number;
export type AnnotationEndVerse = number;
export type AnnotationInit = {
  id?: string;
  content?: string;
  createdAt?: number;
  book: string;
  start: AnnotationStartInit;
  end: AnnotationEndInit;
};

export type AnnotationStartInit = { chapter: number; verse: number };
export type AnnotationEndInit = { chapter: number; verse: number };
export type AnnotationDestructured = {
  id: string;
  content: string;
  createdAt: number;
  book: string;
  start: AnnotationStart;
  end: AnnotationEnd;
};

export type AnnotationStartDestructured = { chapter: number; verse: number };
export type AnnotationEndDestructured = { chapter: number; verse: number };
export type AnnotationSnapshot = {
  id: string;
  content: string;
  createdAt: number;
  book: string;
  start: AnnotationStartSnapshot;
  end: AnnotationEndSnapshot;
};

export type AnnotationStartSnapshot = { chapter: number; verse: number };
export type AnnotationEndSnapshot = { chapter: number; verse: number };

/** Index filters for Annotation **/

export interface AnnotationBookSortFilter {
  where: "book";
  order: "asc" | "desc";
}
export interface AnnotationBookMatchFilter {
  where: "book";
  equals: string;
  order?: "asc" | "desc";
}
export interface AnnotationBookRangeFilter {
  where: "book";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface AnnotationBookStartsWithFilter {
  where: "book";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface AnnotationStartsAtSortFilter {
  where: "startsAt";
  order: "asc" | "desc";
}
export interface AnnotationStartsAtMatchFilter {
  where: "startsAt";
  equals: string;
  order?: "asc" | "desc";
}
export interface AnnotationStartsAtRangeFilter {
  where: "startsAt";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface AnnotationStartsAtStartsWithFilter {
  where: "startsAt";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface AnnotationEndsAtSortFilter {
  where: "endsAt";
  order: "asc" | "desc";
}
export interface AnnotationEndsAtMatchFilter {
  where: "endsAt";
  equals: string;
  order?: "asc" | "desc";
}
export interface AnnotationEndsAtRangeFilter {
  where: "endsAt";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface AnnotationEndsAtStartsWithFilter {
  where: "endsAt";
  startsWith: string;
  order?: "asc" | "desc";
}
export type AnnotationFilter =
  | AnnotationBookSortFilter
  | AnnotationBookMatchFilter
  | AnnotationBookRangeFilter
  | AnnotationBookStartsWithFilter
  | AnnotationStartsAtSortFilter
  | AnnotationStartsAtMatchFilter
  | AnnotationStartsAtRangeFilter
  | AnnotationStartsAtStartsWithFilter
  | AnnotationEndsAtSortFilter
  | AnnotationEndsAtMatchFilter
  | AnnotationEndsAtRangeFilter
  | AnnotationEndsAtStartsWithFilter;
