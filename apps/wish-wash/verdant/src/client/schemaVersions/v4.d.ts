import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type ListSnapshot = { id: string; name: string; createdAt: number };
export type ListInit = { id?: string; name?: string; createdAt?: number };

export type ItemSnapshot = {
  id: string;
  listId: string;
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
export type ItemInit = {
  id?: string;
  listId: string;
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

export type MigrationTypes = {
  lists: { init: ListInit; snapshot: ListSnapshot };
  items: { init: ItemInit; snapshot: ItemSnapshot };
};
