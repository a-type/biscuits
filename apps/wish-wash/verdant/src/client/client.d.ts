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
  readonly lists: CollectionQueries<List, ListInit, ListFilter>;

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

/** Generated types for List */

export type List = ObjectEntity<ListInit, ListDestructured, ListSnapshot>;
export type ListId = string;
export type ListName = string;
export type ListCreatedAt = number;
export type ListItems = ListEntity<
  ListItemsInit,
  ListItemsDestructured,
  ListItemsSnapshot
>;
export type ListItemsItem = ObjectEntity<
  ListItemsItemInit,
  ListItemsItemDestructured,
  ListItemsItemSnapshot
>;
export type ListItemsItemId = string;
export type ListItemsItemDescription = string;
export type ListItemsItemLastPurchasedAt = number;
export type ListItemsItemCreatedAt = number;
export type ListItemsItemLinks = ListEntity<
  ListItemsItemLinksInit,
  ListItemsItemLinksDestructured,
  ListItemsItemLinksSnapshot
>;
export type ListItemsItemLinksItem = string;
export type ListItemsItemImageFiles = ListEntity<
  ListItemsItemImageFilesInit,
  ListItemsItemImageFilesDestructured,
  ListItemsItemImageFilesSnapshot
>;
export type ListItemsItemImageFilesItem = string;
export type ListItemsItemRemoteImageUrl = string;
export type ListItemsItemCount = number;
export type ListItemsItemPurchasedCount = number;
export type ListItemsItemPrioritized = boolean;
export type ListItemsItemType = "idea" | "product" | "vibe";
export type ListItemsItemPriceMin = string;
export type ListItemsItemPriceMax = string;
export type ListItemsItemNote = string;
export type ListInit = {
  id?: string;
  name?: string;
  createdAt?: number;
  items?: ListItemsInit;
};

export type ListItemsItemLinksInit = string[];
export type ListItemsItemImageFilesInit = File[];
export type ListItemsItemInit = {
  id?: string;
  description?: string;
  lastPurchasedAt?: number | null;
  createdAt?: number;
  links?: ListItemsItemLinksInit;
  imageFiles?: ListItemsItemImageFilesInit;
  remoteImageUrl?: string | null;
  count?: number;
  purchasedCount?: number;
  prioritized?: boolean;
  type?: "idea" | "product" | "vibe";
  priceMin?: string | null;
  priceMax?: string | null;
  note?: string | null;
};
export type ListItemsInit = ListItemsItemInit[];
export type ListDestructured = {
  id: string;
  name: string;
  createdAt: number;
  items: ListItems;
};

export type ListItemsItemLinksDestructured = string[];
export type ListItemsItemImageFilesDestructured = EntityFile[];
export type ListItemsItemDestructured = {
  id: string;
  description: string;
  lastPurchasedAt: number | null;
  createdAt: number;
  links: ListItemsItemLinks;
  imageFiles: ListItemsItemImageFiles;
  remoteImageUrl: string | null;
  count: number;
  purchasedCount: number;
  prioritized: boolean;
  type: "idea" | "product" | "vibe";
  priceMin: string | null;
  priceMax: string | null;
  note: string | null;
};
export type ListItemsDestructured = ListItemsItem[];
export type ListSnapshot = {
  id: string;
  name: string;
  createdAt: number;
  items: ListItemsSnapshot;
};

export type ListItemsItemLinksSnapshot = string[];
export type ListItemsItemImageFilesSnapshot = EntityFileSnapshot[];
export type ListItemsItemSnapshot = {
  id: string;
  description: string;
  lastPurchasedAt: number | null;
  createdAt: number;
  links: ListItemsItemLinksSnapshot;
  imageFiles: ListItemsItemImageFilesSnapshot;
  remoteImageUrl: string | null;
  count: number;
  purchasedCount: number;
  prioritized: boolean;
  type: "idea" | "product" | "vibe";
  priceMin: string | null;
  priceMax: string | null;
  note: string | null;
};
export type ListItemsSnapshot = ListItemsItemSnapshot[];

/** Index filters for List **/

export interface ListCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface ListCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface ListCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type ListFilter =
  | ListCreatedAtSortFilter
  | ListCreatedAtMatchFilter
  | ListCreatedAtRangeFilter;
