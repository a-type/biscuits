import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type ListSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  items: ListItemsSnapshot;
};

export type ListItemsItemSnapshot = {
  id: string;
  description: string;
  quantity: number;
  perDays: number;
  additional: number;
  roundDown: boolean;
};
export type ListItemsSnapshot = ListItemsItemSnapshot[];
export type ListInit = {
  id?: string;
  createdAt?: number;
  name?: string;
  items?: ListItemsInit;
};

export type ListItemsItemInit = {
  id?: string;
  description?: string;
  quantity?: number;
  perDays?: number;
  additional?: number;
  roundDown?: boolean;
};
export type ListItemsInit = ListItemsItemInit[];

export type TripSnapshot = {
  id: string;
  createdAt: number;
  lists: TripListsSnapshot;
  name: string;
  completions: TripCompletionsSnapshot;
  startsAt: number | null;
  endsAt: number | null;
  location: TripLocationSnapshot;
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
} | null;
export type TripExtraItemsValueItemSnapshot = {
  id: string;
  description: string;
  quantity: number;
};
export type TripExtraItemsValueSnapshot = TripExtraItemsValueItemSnapshot[];
export type TripExtraItemsSnapshot = {
  [key: string]: TripExtraItemsValueSnapshot;
};
export type TripInit = {
  id?: string;
  createdAt?: number;
  lists?: TripListsInit;
  name?: string;
  completions?: TripCompletionsInit;
  startsAt?: number | null;
  endsAt?: number | null;
  location?: TripLocationInit;
  extraItems?: TripExtraItemsInit;
};

export type TripListsInit = string[];
export type TripCompletionsInit = { [key: string]: TripCompletionsValueInit };
export type TripLocationInit = {
  name: string;
  latitude: number;
  longitude: number;
} | null;
export type TripExtraItemsValueItemInit = {
  id?: string;
  description?: string;
  quantity?: number;
};
export type TripExtraItemsValueInit = TripExtraItemsValueItemInit[];
export type TripExtraItemsInit = { [key: string]: TripExtraItemsValueInit };

export type MigrationTypes = {
  lists: { init: ListInit; snapshot: ListSnapshot };
  trips: { init: TripInit; snapshot: TripSnapshot };
};
