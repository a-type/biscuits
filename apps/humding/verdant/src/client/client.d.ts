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
  readonly songs: CollectionQueries<Song, SongInit, SongFilter>;

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

/** Generated types for Song */

export type Song = ObjectEntity<SongInit, SongDestructured, SongSnapshot>;
export type SongId = string;
export type SongCreatedAt = number;
export type SongTitle = string;
export type SongLines = ListEntity<
  SongLinesInit,
  SongLinesDestructured,
  SongLinesSnapshot
>;
export type SongLinesItem = ObjectEntity<
  SongLinesItemInit,
  SongLinesItemDestructured,
  SongLinesItemSnapshot
>;
export type SongLinesItemWords = ListEntity<
  SongLinesItemWordsInit,
  SongLinesItemWordsDestructured,
  SongLinesItemWordsSnapshot
>;
export type SongLinesItemWordsItem = ObjectEntity<
  SongLinesItemWordsItemInit,
  SongLinesItemWordsItemDestructured,
  SongLinesItemWordsItemSnapshot
>;
export type SongLinesItemWordsItemId = string;
export type SongLinesItemWordsItemText = string;
export type SongLinesItemWordsItemGapStart = number;
export type SongLinesItemWordsItemChords = ListEntity<
  SongLinesItemWordsItemChordsInit,
  SongLinesItemWordsItemChordsDestructured,
  SongLinesItemWordsItemChordsSnapshot
>;
export type SongLinesItemWordsItemChordsItem = ObjectEntity<
  SongLinesItemWordsItemChordsItemInit,
  SongLinesItemWordsItemChordsItemDestructured,
  SongLinesItemWordsItemChordsItemSnapshot
>;
export type SongLinesItemWordsItemChordsItemId = string;
export type SongLinesItemWordsItemChordsItemValue = string;
export type SongLinesItemWordsItemChordsItemOffset = number;
export type SongInit = {
  id?: string;
  createdAt?: number;
  title: string;
  lines?: SongLinesInit;
};

export type SongLinesItemWordsItemChordsItemInit = {
  id?: string;
  value?: string;
  offset?: number;
};
export type SongLinesItemWordsItemChordsInit =
  SongLinesItemWordsItemChordsItemInit[];
export type SongLinesItemWordsItemInit = {
  id?: string;
  text?: string;
  gapStart?: number;
  chords?: SongLinesItemWordsItemChordsInit;
};
export type SongLinesItemWordsInit = SongLinesItemWordsItemInit[];
export type SongLinesItemInit = { words?: SongLinesItemWordsInit };
export type SongLinesInit = SongLinesItemInit[];
export type SongDestructured = {
  id: string;
  createdAt: number;
  title: string;
  lines: SongLines;
};

export type SongLinesItemWordsItemChordsItemDestructured = {
  id: string;
  value: string;
  offset: number;
};
export type SongLinesItemWordsItemChordsDestructured =
  SongLinesItemWordsItemChordsItem[];
export type SongLinesItemWordsItemDestructured = {
  id: string;
  text: string;
  gapStart: number;
  chords: SongLinesItemWordsItemChords;
};
export type SongLinesItemWordsDestructured = SongLinesItemWordsItem[];
export type SongLinesItemDestructured = { words: SongLinesItemWords };
export type SongLinesDestructured = SongLinesItem[];
export type SongSnapshot = {
  id: string;
  createdAt: number;
  title: string;
  lines: SongLinesSnapshot;
};

export type SongLinesItemWordsItemChordsItemSnapshot = {
  id: string;
  value: string;
  offset: number;
};
export type SongLinesItemWordsItemChordsSnapshot =
  SongLinesItemWordsItemChordsItemSnapshot[];
export type SongLinesItemWordsItemSnapshot = {
  id: string;
  text: string;
  gapStart: number;
  chords: SongLinesItemWordsItemChordsSnapshot;
};
export type SongLinesItemWordsSnapshot = SongLinesItemWordsItemSnapshot[];
export type SongLinesItemSnapshot = { words: SongLinesItemWordsSnapshot };
export type SongLinesSnapshot = SongLinesItemSnapshot[];

/** Index filters for Song **/

export interface SongCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface SongCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface SongCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type SongFilter =
  | SongCreatedAtSortFilter
  | SongCreatedAtMatchFilter
  | SongCreatedAtRangeFilter;
