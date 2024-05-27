import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type ItemSnapshot = {
  id: string;
  content: string;
  done: boolean;
  createdAt: number;
};
export type ItemInit = {
  id?: string;
  content?: string;
  done?: boolean;
  createdAt?: number;
};

export type MigrationTypes = {
  items: { init: ItemInit; snapshot: ItemSnapshot };
};
