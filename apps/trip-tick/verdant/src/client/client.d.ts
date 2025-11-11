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

  /** Collection access for Trip. Load queries, put and delete documents. */
  readonly trips: CollectionQueries<Trip, TripInit, TripFilter>;

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
export type ListCreatedAt = number;
export type ListName = string;
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
export type ListItemsItemQuantity = number;
export type ListItemsItemPeriod = "trip" | "day" | "night";
export type ListItemsItemConditions = ListEntity<
  ListItemsItemConditionsInit,
  ListItemsItemConditionsDestructured,
  ListItemsItemConditionsSnapshot
>;
export type ListItemsItemConditionsItem = ObjectEntity<
  ListItemsItemConditionsItemInit,
  ListItemsItemConditionsItemDestructured,
  ListItemsItemConditionsItemSnapshot
>;
export type ListItemsItemConditionsItemType = "rain" | "hot" | "cold";
export type ListItemsItemConditionsItemParams = ObjectEntity<
  ListItemsItemConditionsItemParamsInit,
  ListItemsItemConditionsItemParamsDestructured,
  ListItemsItemConditionsItemParamsSnapshot
>;
export type ListItemsItemConditionsItemParamsValue = any;
export type ListItemsItemPeriodMultiplier = number;
export type ListItemsItemAdditional = number;
export type ListItemsItemRoundDown = boolean;
export type ListInit = {
  id?: string;
  createdAt?: number;
  name?: string;
  items?: ListItemsInit;
};

export type ListItemsItemConditionsItemParamsInit = {
  [key: string]: ListItemsItemConditionsItemParamsValueInit;
};
export type ListItemsItemConditionsItemInit = {
  type: "rain" | "hot" | "cold";
  params?: ListItemsItemConditionsItemParamsInit;
};
export type ListItemsItemConditionsInit = ListItemsItemConditionsItemInit[];
export type ListItemsItemInit = {
  id?: string;
  description?: string;
  quantity?: number;
  period?: "trip" | "day" | "night";
  conditions?: ListItemsItemConditionsInit;
  periodMultiplier?: number;
  additional?: number;
  roundDown?: boolean;
};
export type ListItemsInit = ListItemsItemInit[];
export type ListDestructured = {
  id: string;
  createdAt: number;
  name: string;
  items: ListItems;
};

export type ListItemsItemConditionsItemParamsDestructured = {
  [key: string]: ListItemsItemConditionsItemParamsValue | undefined;
};
export type ListItemsItemConditionsItemDestructured = {
  type: "rain" | "hot" | "cold";
  params: ListItemsItemConditionsItemParams;
};
export type ListItemsItemConditionsDestructured = ListItemsItemConditionsItem[];
export type ListItemsItemDestructured = {
  id: string;
  description: string;
  quantity: number;
  period: "trip" | "day" | "night";
  conditions: ListItemsItemConditions;
  periodMultiplier: number;
  additional: number;
  roundDown: boolean;
};
export type ListItemsDestructured = ListItemsItem[];
export type ListSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  items: ListItemsSnapshot;
};

export type ListItemsItemConditionsItemParamsSnapshot = {
  [key: string]: ListItemsItemConditionsItemParamsValueSnapshot;
};
export type ListItemsItemConditionsItemSnapshot = {
  type: "rain" | "hot" | "cold";
  params: ListItemsItemConditionsItemParamsSnapshot;
};
export type ListItemsItemConditionsSnapshot =
  ListItemsItemConditionsItemSnapshot[];
export type ListItemsItemSnapshot = {
  id: string;
  description: string;
  quantity: number;
  period: "trip" | "day" | "night";
  conditions: ListItemsItemConditionsSnapshot;
  periodMultiplier: number;
  additional: number;
  roundDown: boolean;
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

/** Generated types for Trip */

export type Trip = ObjectEntity<TripInit, TripDestructured, TripSnapshot>;
export type TripId = string;
export type TripCreatedAt = number;
export type TripLists = ListEntity<
  TripListsInit,
  TripListsDestructured,
  TripListsSnapshot
>;
export type TripListsItem = string;
export type TripName = string;
export type TripCompletions = ObjectEntity<
  TripCompletionsInit,
  TripCompletionsDestructured,
  TripCompletionsSnapshot
>;
export type TripCompletionsValue = number;
export type TripStartsAt = number;
export type TripEndsAt = number;
export type TripLocation = ObjectEntity<
  TripLocationInit,
  TripLocationDestructured,
  TripLocationSnapshot
>;
export type TripLocationName = string;
export type TripLocationLatitude = number;
export type TripLocationLongitude = number;
export type TripExtraItems = ObjectEntity<
  TripExtraItemsInit,
  TripExtraItemsDestructured,
  TripExtraItemsSnapshot
>;
export type TripExtraItemsValue = ListEntity<
  TripExtraItemsValueInit,
  TripExtraItemsValueDestructured,
  TripExtraItemsValueSnapshot
>;
export type TripExtraItemsValueItem = ObjectEntity<
  TripExtraItemsValueItemInit,
  TripExtraItemsValueItemDestructured,
  TripExtraItemsValueItemSnapshot
>;
export type TripExtraItemsValueItemId = string;
export type TripExtraItemsValueItemDescription = string;
export type TripExtraItemsValueItemQuantity = number;
export type TripInit = {
  id?: string;
  createdAt?: number;
  lists?: TripListsInit;
  name?: string;
  completions?: TripCompletionsInit;
  startsAt?: number | null;
  endsAt?: number | null;
  location?: TripLocationInit | null;
  extraItems?: TripExtraItemsInit;
};

export type TripListsInit = string[];
export type TripCompletionsInit = { [key: string]: TripCompletionsValueInit };
export type TripLocationInit = {
  name: string;
  latitude: number;
  longitude: number;
};
export type TripExtraItemsValueItemInit = {
  id?: string;
  description?: string;
  quantity?: number;
};
export type TripExtraItemsValueInit = TripExtraItemsValueItemInit[];
export type TripExtraItemsInit = { [key: string]: TripExtraItemsValueInit };
export type TripDestructured = {
  id: string;
  createdAt: number;
  lists: TripLists;
  name: string;
  completions: TripCompletions;
  startsAt: number | null;
  endsAt: number | null;
  location: TripLocation | null;
  extraItems: TripExtraItems;
};

export type TripListsDestructured = string[];
export type TripCompletionsDestructured = {
  [key: string]: TripCompletionsValue | undefined;
};
export type TripLocationDestructured = {
  name: string;
  latitude: number;
  longitude: number;
};
export type TripExtraItemsValueItemDestructured = {
  id: string;
  description: string;
  quantity: number;
};
export type TripExtraItemsValueDestructured = TripExtraItemsValueItem[];
export type TripExtraItemsDestructured = {
  [key: string]: TripExtraItemsValue | undefined;
};
export type TripSnapshot = {
  id: string;
  createdAt: number;
  lists: TripListsSnapshot;
  name: string;
  completions: TripCompletionsSnapshot;
  startsAt: number | null;
  endsAt: number | null;
  location: TripLocationSnapshot | null;
  extraItems: TripExtraItemsSnapshot;
};

export type TripListsSnapshot = string[];
export type TripCompletionsSnapshot = {
  [key: string]: TripCompletionsValueSnapshot;
};
export type TripLocationSnapshot = {
  name: string;
  latitude: number;
  longitude: number;
};
export type TripExtraItemsValueItemSnapshot = {
  id: string;
  description: string;
  quantity: number;
};
export type TripExtraItemsValueSnapshot = TripExtraItemsValueItemSnapshot[];
export type TripExtraItemsSnapshot = {
  [key: string]: TripExtraItemsValueSnapshot;
};

/** Index filters for Trip **/

export interface TripCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface TripCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface TripCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface TripStartsAtSortFilter {
  where: "startsAt";
  order: "asc" | "desc";
}
export interface TripStartsAtMatchFilter {
  where: "startsAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface TripStartsAtRangeFilter {
  where: "startsAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type TripFilter =
  | TripCreatedAtSortFilter
  | TripCreatedAtMatchFilter
  | TripCreatedAtRangeFilter
  | TripStartsAtSortFilter
  | TripStartsAtMatchFilter
  | TripStartsAtRangeFilter;
