import type schema from "./schema.js";
import type { StorageSchema } from "@verdant-web/common";
import type {
  Storage,
  StorageInitOptions,
  ObjectEntity,
  ListEntity,
  Query,
  ServerSync,
  EntityFile,
  CollectionQueries,
} from "@verdant-web/store";
export * from "@verdant-web/store";
export type Schema = typeof schema;

interface Collection<
  Document extends ObjectEntity<any, any>,
  Snapshot,
  Init,
  Filter
> {
  put: (init: Init, options?: { undoable?: boolean }) => Promise<Document>;
  delete: (id: string, options?: { undoable?: boolean }) => Promise<void>;
  deleteAll: (ids: string[], options?: { undoable?: boolean }) => Promise<void>;
  get: (id: string) => Query<Document>;
  findOne: (filter: Filter) => Query<Document>;
  findAll: (filter?: Filter) => Query<Document[]>;
  findAllPaginated: (
    filter?: Filter,
    pageSize?: number
  ) => Query<Document[], { offset?: number }>;
  findAllInfinite: (
    filter?: Filter,
    pageSize?: number
  ) => Query<Document[], { offset?: number }>;
}

export class Client<Presence = any, Profile = any> {
  readonly lists: CollectionQueries<List, ListInit, ListFilter>;

  readonly trips: CollectionQueries<Trip, TripInit, TripFilter>;

  sync: ServerSync<Profile, Presence>;
  undoHistory: Storage["undoHistory"];
  namespace: Storage["namespace"];
  entities: Storage["entities"];
  queryStore: Storage["queryStore"];
  batch: Storage["batch"];
  files: Storage["files"];

  close: Storage["close"];

  export: Storage["export"];
  import: Storage["import"];

  stats: () => Promise<any>;
  /**
   * Resets all local data. Use with caution. If this replica
   * is synced, it can restore from the server, but if it is not,
   * the data will be permanently lost.
   */
  __dangerous__resetLocal: Storage["__dangerous__resetLocal"];
}

// schema is provided internally. loadInitialData must be revised to pass the typed Client
interface ClientInitOptions<Presence = any, Profile = any>
  extends Omit<StorageInitOptions<Presence, Profile>, "schema"> {}

export class ClientDescriptor<Presence = any, Profile = any> {
  constructor(init: ClientInitOptions<Presence, Profile>);
  open: () => Promise<Client<Presence, Profile>>;
  readonly current: Client<Presence, Profile> | null;
  readonly readyPromise: Promise<Client<Presence, Profile>>;
  readonly schema: StorageSchema;
  readonly namespace: string;
  close: () => Promise<void>;
}
export type List = ObjectEntity<ListInit, ListDestructured>;

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

export type ListFilter = ListCreatedAtMatchFilter | ListCreatedAtRangeFilter;

export type ListDestructured = {
  id: string;
  createdAt: number;
  name: string;
  items: ListItems;
};
export type ListInit = {
  id?: string;
  createdAt?: number;
  name?: string;
  items?: ListItemsInit;
};
export type ListSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  items: ListItemsSnapshot;
};
/** List sub-object types */

export type ListId = string;
export type ListIdInit = ListId | undefined;
export type ListIdSnapshot = ListId;
export type ListIdDestructured = ListId;
export type ListCreatedAt = number;
export type ListCreatedAtInit = ListCreatedAt | undefined;
export type ListCreatedAtSnapshot = ListCreatedAt;
export type ListCreatedAtDestructured = ListCreatedAt;
export type ListName = string;
export type ListNameInit = ListName | undefined;
export type ListNameSnapshot = ListName;
export type ListNameDestructured = ListName;
export type ListItems = ListEntity<ListItemsInit, ListItemsDestructured>;
export type ListItemsInit = Array<ListItemsItemInit>;
export type ListItemsDestructured = Array<ListItemsItem>;
export type ListItemsSnapshot = Array<ListItemsItemSnapshot>;
export type ListItemsItem = ObjectEntity<
  ListItemsItemInit,
  ListItemsItemDestructured
>;
export type ListItemsItemInit = {
  id?: string;
  description?: string;
  quantity?: number;
  perDays?: number;
  additional?: number;
  roundDown?: boolean;
};
export type ListItemsItemDestructured = {
  id: string;
  description: string;
  quantity: number;
  perDays: number;
  additional: number;
  roundDown: boolean;
};
export type ListItemsItemSnapshot = {
  id: string;
  description: string;
  quantity: number;
  perDays: number;
  additional: number;
  roundDown: boolean;
};
export type ListItemsItemId = string;
export type ListItemsItemIdInit = ListItemsItemId | undefined;
export type ListItemsItemIdSnapshot = ListItemsItemId;
export type ListItemsItemIdDestructured = ListItemsItemId;
export type ListItemsItemDescription = string;
export type ListItemsItemDescriptionInit = ListItemsItemDescription | undefined;
export type ListItemsItemDescriptionSnapshot = ListItemsItemDescription;
export type ListItemsItemDescriptionDestructured = ListItemsItemDescription;
export type ListItemsItemQuantity = number;
export type ListItemsItemQuantityInit = ListItemsItemQuantity | undefined;
export type ListItemsItemQuantitySnapshot = ListItemsItemQuantity;
export type ListItemsItemQuantityDestructured = ListItemsItemQuantity;
export type ListItemsItemPerDays = number;
export type ListItemsItemPerDaysInit = ListItemsItemPerDays | undefined;
export type ListItemsItemPerDaysSnapshot = ListItemsItemPerDays;
export type ListItemsItemPerDaysDestructured = ListItemsItemPerDays;
export type ListItemsItemAdditional = number;
export type ListItemsItemAdditionalInit = ListItemsItemAdditional | undefined;
export type ListItemsItemAdditionalSnapshot = ListItemsItemAdditional;
export type ListItemsItemAdditionalDestructured = ListItemsItemAdditional;
export type ListItemsItemRoundDown = boolean;
export type ListItemsItemRoundDownInit = ListItemsItemRoundDown | undefined;
export type ListItemsItemRoundDownSnapshot = ListItemsItemRoundDown;
export type ListItemsItemRoundDownDestructured = ListItemsItemRoundDown;

export type Trip = ObjectEntity<TripInit, TripDestructured>;

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

export type TripFilter = TripCreatedAtMatchFilter | TripCreatedAtRangeFilter;

export type TripDestructured = {
  id: string;
  createdAt: number;
  lists: TripLists;
  days: number;
  name: string;
  completions: TripCompletions;
};
export type TripInit = {
  id?: string;
  createdAt?: number;
  lists?: TripListsInit;
  days?: number;
  name?: string;
  completions?: TripCompletionsInit;
};
export type TripSnapshot = {
  id: string;
  createdAt: number;
  lists: TripListsSnapshot;
  days: number;
  name: string;
  completions: TripCompletionsSnapshot;
};
/** Trip sub-object types */

export type TripId = string;
export type TripIdInit = TripId | undefined;
export type TripIdSnapshot = TripId;
export type TripIdDestructured = TripId;
export type TripCreatedAt = number;
export type TripCreatedAtInit = TripCreatedAt | undefined;
export type TripCreatedAtSnapshot = TripCreatedAt;
export type TripCreatedAtDestructured = TripCreatedAt;
export type TripLists = ListEntity<TripListsInit, TripListsDestructured>;
export type TripListsInit = Array<TripListsItemInit>;
export type TripListsDestructured = Array<TripListsItem>;
export type TripListsSnapshot = Array<TripListsItemSnapshot>;
export type TripListsItem = string;
export type TripListsItemInit = TripListsItem;
export type TripListsItemSnapshot = TripListsItem;
export type TripListsItemDestructured = TripListsItem;
export type TripDays = number;
export type TripDaysInit = TripDays | undefined;
export type TripDaysSnapshot = TripDays;
export type TripDaysDestructured = TripDays;
export type TripName = string;
export type TripNameInit = TripName | undefined;
export type TripNameSnapshot = TripName;
export type TripNameDestructured = TripName;
export type TripCompletions = ObjectEntity<
  TripCompletionsInit,
  TripCompletionsDestructured
>;
export type TripCompletionsInit = Record<string, TripCompletionsValueInit>;
export type TripCompletionsDestructured = {
  [key: string]: TripCompletionsValue | undefined;
};
export type TripCompletionsSnapshot = Record<
  string,
  TripCompletionsValueSnapshot
>;
export type TripCompletionsValue = number;
export type TripCompletionsValueInit = TripCompletionsValue;
export type TripCompletionsValueSnapshot = TripCompletionsValue;
export type TripCompletionsValueDestructured = TripCompletionsValue;
