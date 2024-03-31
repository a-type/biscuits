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
  readonly trips: CollectionQueries<Trip, TripInit, TripFilter>;

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
export type ListItemsItemPerDays = number;
export type ListItemsItemAdditional = number;
export type ListItemsItemRoundDown = boolean;
export type ListItemsItemCondition = ObjectEntity<
  ListItemsItemConditionInit,
  ListItemsItemConditionDestructured,
  ListItemsItemConditionSnapshot
> | null;
export type ListItemsItemConditionType = string;
export type ListItemsItemConditionValue = any;
export type ListInit = {
  id?: string;
  createdAt?: number;
  name?: string;
  items?: ListItemsInit;
};

export type ListItemsItemConditionInit = {
  type: string;
  value?: any | null;
} | null;
export type ListItemsItemInit = {
  id?: string;
  description?: string;
  quantity?: number;
  perDays?: number;
  additional?: number;
  roundDown?: boolean;
  condition?: ListItemsItemConditionInit;
};
export type ListItemsInit = ListItemsItemInit[];
export type ListDestructured = {
  id: string;
  createdAt: number;
  name: string;
  items: ListItems;
};

export type ListItemsItemConditionDestructured = {
  type: string;
  value: any | null;
};
export type ListItemsItemDestructured = {
  id: string;
  description: string;
  quantity: number;
  perDays: number;
  additional: number;
  roundDown: boolean;
  condition: ListItemsItemCondition;
};
export type ListItemsDestructured = ListItemsItem[];
export type ListSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  items: ListItemsSnapshot;
};

export type ListItemsItemConditionSnapshot = {
  type: string;
  value: any | null;
} | null;
export type ListItemsItemSnapshot = {
  id: string;
  description: string;
  quantity: number;
  perDays: number;
  additional: number;
  roundDown: boolean;
  condition: ListItemsItemConditionSnapshot;
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
> | null;
export type TripLocationName = string;
export type TripLocationLatitude = number;
export type TripLocationLongitude = number;
export type TripInit = {
  id?: string;
  createdAt?: number;
  lists?: TripListsInit;
  name?: string;
  completions?: TripCompletionsInit;
  startsAt?: number | null;
  endsAt?: number | null;
  location?: TripLocationInit;
};

export type TripListsInit = string[];
export type TripCompletionsInit = { [key: string]: TripCompletionsValueInit };
export type TripLocationInit = {
  name: string;
  latitude: number;
  longitude: number;
} | null;
export type TripDestructured = {
  id: string;
  createdAt: number;
  lists: TripLists;
  name: string;
  completions: TripCompletions;
  startsAt: number | null;
  endsAt: number | null;
  location: TripLocation;
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
export type TripSnapshot = {
  id: string;
  createdAt: number;
  lists: TripListsSnapshot;
  name: string;
  completions: TripCompletionsSnapshot;
  startsAt: number | null;
  endsAt: number | null;
  location: TripLocationSnapshot;
};

export type TripListsSnapshot = string[];
export type TripCompletionsSnapshot = {
  [key: string]: TripCompletionsValueSnapshot;
};
export type TripLocationSnapshot = {
  name: string;
  latitude: number;
  longitude: number;
} | null;

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
export type TripFilter =
  | TripCreatedAtSortFilter
  | TripCreatedAtMatchFilter
  | TripCreatedAtRangeFilter;
