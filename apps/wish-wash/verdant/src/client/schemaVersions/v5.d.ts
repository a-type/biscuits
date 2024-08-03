import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type ListSnapshot = {
  id: string;
  name: string;
  createdAt: number;
  items: ListItemsSnapshot;
};

export type ListItemsItemSnapshot = {
  id: string;
  description: string;
  purchasedAt: number | null;
  createdAt: number;
  link: string | null;
  expiresAt: number | null;
  expirationNotificationSent: boolean;
  imageUrl: string | null;
  imageFile: EntityFileSnapshot | null;
  count: number;
  prioritized: boolean;
};
export type ListItemsSnapshot = ListItemsItemSnapshot[];
export type ListInit = {
  id?: string;
  name?: string;
  createdAt?: number;
  items?: ListItemsInit;
};

export type ListItemsItemInit = {
  id?: string;
  description?: string;
  purchasedAt?: number | null;
  createdAt?: number;
  link?: string | null;
  expiresAt?: number | null;
  expirationNotificationSent?: boolean;
  imageUrl?: string | null;
  imageFile?: File | null;
  count?: number;
  prioritized?: boolean;
};
export type ListItemsInit = ListItemsItemInit[];

export type MigrationTypes = {
  lists: { init: ListInit; snapshot: ListSnapshot };
};
