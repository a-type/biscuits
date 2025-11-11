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
  /** Collection access for List. Load queries, put and delete documents. */
  readonly lists: CollectionQueries<List, ListInit, ListFilter>;

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

/** Generated types for List */

export type List = ObjectEntity<ListInit, ListDestructured, ListSnapshot>;
export type ListId = string;
export type ListName = string;
export type ListCreatedAt = number;
export type ListType = "shopping" | "wishlist" | "ideas";
/** IDs of onboarding questions that have been completed */
export type ListCompletedQuestions = ListEntity<
  ListCompletedQuestionsInit,
  ListCompletedQuestionsDestructured,
  ListCompletedQuestionsSnapshot
>;
export type ListCompletedQuestionsItem = string;
export type ListLinkedPublicListSlug = string;
export type ListWebWishlistLinks = ListEntity<
  ListWebWishlistLinksInit,
  ListWebWishlistLinksDestructured,
  ListWebWishlistLinksSnapshot
>;
export type ListWebWishlistLinksItem = string;
export type ListDescription = string;
export type ListCoverImage = EntityFile;
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
/** If this item was created from a survey question, this is the question. */
export type ListItemsItemPrompt = string;
export type ListItemsItemLastPurchasedAt = number;
export type ListItemsItemCreatedAt = number;
/** If set, the item is considered expired after this timestamp asn the user is prompted as to whether it is still wanted. */
export type ListItemsItemExpiresAt = number;
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
export type ListItemsItemImageFilesItem = EntityFile;
export type ListItemsItemRemoteImageUrl = string;
export type ListItemsItemCount = number;
export type ListItemsItemPurchasedCount = number;
export type ListItemsItemPrioritized = boolean;
export type ListItemsItemType = "idea" | "link" | "vibe";
export type ListItemsItemPriceMin = string;
export type ListItemsItemPriceMax = string;
export type ListItemsItemNote = string;
export type ListConfirmedRemotePurchases = ListEntity<
  ListConfirmedRemotePurchasesInit,
  ListConfirmedRemotePurchasesDestructured,
  ListConfirmedRemotePurchasesSnapshot
>;
export type ListConfirmedRemotePurchasesItem = string;
export type ListInit = {
  id?: string;
  name?: string;
  createdAt?: number;
  type?: "shopping" | "wishlist" | "ideas";
  completedQuestions?: ListCompletedQuestionsInit;
  linkedPublicListSlug?: string | null;
  webWishlistLinks?: ListWebWishlistLinksInit;
  description?: string | null;
  coverImage?: File | null;
  items?: ListItemsInit;
  confirmedRemotePurchases?: ListConfirmedRemotePurchasesInit;
};

export type ListCompletedQuestionsInit = string[];
export type ListWebWishlistLinksInit = string[];
export type ListItemsItemLinksInit = string[];
export type ListItemsItemImageFilesInit = File[];
export type ListItemsItemInit = {
  id?: string;
  description?: string;
  prompt?: string | null;
  lastPurchasedAt?: number | null;
  createdAt?: number;
  expiresAt?: number | null;
  links?: ListItemsItemLinksInit;
  imageFiles?: ListItemsItemImageFilesInit;
  remoteImageUrl?: string | null;
  count?: number;
  purchasedCount?: number;
  prioritized?: boolean;
  type?: "idea" | "link" | "vibe";
  priceMin?: string | null;
  priceMax?: string | null;
  note?: string | null;
};
export type ListItemsInit = ListItemsItemInit[];
export type ListConfirmedRemotePurchasesInit = string[];
export type ListDestructured = {
  id: string;
  name: string;
  createdAt: number;
  type: "shopping" | "wishlist" | "ideas";
  completedQuestions: ListCompletedQuestions;
  linkedPublicListSlug: string | null;
  webWishlistLinks: ListWebWishlistLinks;
  description: string | null;
  coverImage: EntityFile | null;
  items: ListItems;
  confirmedRemotePurchases: ListConfirmedRemotePurchases;
};

export type ListCompletedQuestionsDestructured = string[];
export type ListWebWishlistLinksDestructured = string[];
export type ListItemsItemLinksDestructured = string[];
export type ListItemsItemImageFilesDestructured = EntityFile[];
export type ListItemsItemDestructured = {
  id: string;
  description: string;
  prompt: string | null;
  lastPurchasedAt: number | null;
  createdAt: number;
  expiresAt: number | null;
  links: ListItemsItemLinks;
  imageFiles: ListItemsItemImageFiles;
  remoteImageUrl: string | null;
  count: number;
  purchasedCount: number;
  prioritized: boolean;
  type: "idea" | "link" | "vibe";
  priceMin: string | null;
  priceMax: string | null;
  note: string | null;
};
export type ListItemsDestructured = ListItemsItem[];
export type ListConfirmedRemotePurchasesDestructured = string[];
export type ListSnapshot = {
  id: string;
  name: string;
  createdAt: number;
  type: "shopping" | "wishlist" | "ideas";
  completedQuestions: ListCompletedQuestionsSnapshot;
  linkedPublicListSlug: string | null;
  webWishlistLinks: ListWebWishlistLinksSnapshot;
  description: string | null;
  coverImage: EntityFileSnapshot | null;
  items: ListItemsSnapshot;
  confirmedRemotePurchases: ListConfirmedRemotePurchasesSnapshot;
};

export type ListCompletedQuestionsSnapshot = string[];
export type ListWebWishlistLinksSnapshot = string[];
export type ListItemsItemLinksSnapshot = string[];
export type ListItemsItemImageFilesSnapshot = EntityFileSnapshot[];
export type ListItemsItemSnapshot = {
  id: string;
  description: string;
  prompt: string | null;
  lastPurchasedAt: number | null;
  createdAt: number;
  expiresAt: number | null;
  links: ListItemsItemLinksSnapshot;
  imageFiles: ListItemsItemImageFilesSnapshot;
  remoteImageUrl: string | null;
  count: number;
  purchasedCount: number;
  prioritized: boolean;
  type: "idea" | "link" | "vibe";
  priceMin: string | null;
  priceMax: string | null;
  note: string | null;
};
export type ListItemsSnapshot = ListItemsItemSnapshot[];
export type ListConfirmedRemotePurchasesSnapshot = string[];

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
