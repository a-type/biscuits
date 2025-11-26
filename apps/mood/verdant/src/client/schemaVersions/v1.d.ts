import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type EntrySnapshot = {
  id: string;
  createdAt: number;
  value: number | null;
  tags: EntryTagsSnapshot;
};

export type EntryTagsSnapshot = string[];
export type EntryInit = {
  id?: string;
  createdAt?: number;
  value?: number | null;
  tags?: EntryTagsInit;
};

export type EntryTagsInit = string[];

export type TagSnapshot = {
  value: string;
  createdAt: number;
  lastUsedAt: number;
  useCount: number;
  color: string | null;
};
export type TagInit = {
  value: string;
  createdAt?: number;
  lastUsedAt?: number;
  useCount?: number;
  color?: string | null;
};

export type MigrationTypes = {
  entries: { init: EntryInit; snapshot: EntrySnapshot };
  tags: { init: TagInit; snapshot: TagSnapshot };
};
