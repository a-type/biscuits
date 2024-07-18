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
  readonly items: CollectionQueries<Item, ItemInit, ItemFilter>;

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
export type ListInit = { id?: string; name?: string; createdAt?: number };

export type ListDestructured = { id: string; name: string; createdAt: number };

export type ListSnapshot = { id: string; name: string; createdAt: number };

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

/** Generated types for Item */

export type Item = ObjectEntity<ItemInit, ItemDestructured, ItemSnapshot>;
export type ItemId = string;
export type ItemListId = string;
export type ItemDescription = string;
export type ItemPurchasedAt = number;
export type ItemCreatedAt = number;
export type ItemLink = string;
export type ItemExpiresAt = number;
export type ItemImageUrl = string;
export type ItemImageFile = string | null;
export type ItemCount = number;
export type ItemPrioritized = boolean;
export type ItemInit = {
  id?: string;
  listId: string;
  description?: string;
  purchasedAt?: number | null;
  createdAt?: number;
  link?: string | null;
  expiresAt?: number | null;
  imageUrl?: string | null;
  imageFile?: File | null;
  count?: number;
  prioritized?: boolean;
};

export type ItemDestructured = {
  id: string;
  listId: string;
  description: string;
  purchasedAt: number | null;
  createdAt: number;
  link: string | null;
  expiresAt: number | null;
  imageUrl: string | null;
  imageFile: EntityFile | null;
  count: number;
  prioritized: boolean;
};

export type ItemSnapshot = {
  id: string;
  listId: string;
  description: string;
  purchasedAt: number | null;
  createdAt: number;
  link: string | null;
  expiresAt: number | null;
  imageUrl: string | null;
  imageFile: EntityFileSnapshot | null;
  count: number;
  prioritized: boolean;
};

/** Index filters for Item **/

export interface ItemListIdSortFilter {
  where: "listId";
  order: "asc" | "desc";
}
export interface ItemListIdMatchFilter {
  where: "listId";
  equals: string;
  order?: "asc" | "desc";
}
export interface ItemListIdRangeFilter {
  where: "listId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ItemListIdStartsWithFilter {
  where: "listId";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface ItemCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface ItemCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface ItemCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface ItemPurchasedAtSortFilter {
  where: "purchasedAt";
  order: "asc" | "desc";
}
export interface ItemPurchasedAtMatchFilter {
  where: "purchasedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface ItemPurchasedAtRangeFilter {
  where: "purchasedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface ItemPrioritizedThenCreatedAtSortFilter {
  where: "prioritizedThenCreatedAt";
  order: "asc" | "desc";
}
export interface ItemPrioritizedThenCreatedAtMatchFilter {
  where: "prioritizedThenCreatedAt";
  equals: string;
  order?: "asc" | "desc";
}
export interface ItemPrioritizedThenCreatedAtRangeFilter {
  where: "prioritizedThenCreatedAt";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ItemPrioritizedThenCreatedAtStartsWithFilter {
  where: "prioritizedThenCreatedAt";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface ItemListOrderCompoundFilter {
  where: "listOrder";
  match: {
    listId: string;
    prioritizedThenCreatedAt?: string;
  };
  order?: "asc" | "desc";
}
export type ItemFilter =
  | ItemListIdSortFilter
  | ItemListIdMatchFilter
  | ItemListIdRangeFilter
  | ItemListIdStartsWithFilter
  | ItemCreatedAtSortFilter
  | ItemCreatedAtMatchFilter
  | ItemCreatedAtRangeFilter
  | ItemPurchasedAtSortFilter
  | ItemPurchasedAtMatchFilter
  | ItemPurchasedAtRangeFilter
  | ItemPrioritizedThenCreatedAtSortFilter
  | ItemPrioritizedThenCreatedAtMatchFilter
  | ItemPrioritizedThenCreatedAtRangeFilter
  | ItemPrioritizedThenCreatedAtStartsWithFilter
  | ItemListOrderCompoundFilter;
