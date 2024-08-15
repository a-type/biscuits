import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

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
  count: number;
  purchasedCount: number;
  prioritized: boolean;
  type: "idea" | "product" | "vibe";
  priceMin: string | null;
  priceMax: string | null;
  note: string | null;
};
export type ListItemsSnapshot = ListItemsItemSnapshot[];
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
  count?: number;
  purchasedCount?: number;
  prioritized?: boolean;
  type?: "idea" | "product" | "vibe";
  priceMin?: string | null;
  priceMax?: string | null;
  note?: string | null;
};
export type ListItemsInit = ListItemsItemInit[];

export type MigrationTypes = {
  lists: { init: ListInit; snapshot: ListSnapshot };
};
