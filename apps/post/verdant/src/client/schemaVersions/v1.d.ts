import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type PostSnapshot = {
  id: string;
  createdAt: number;
  title: string;
  body: PostBodySnapshot;
  coverImage: EntityFileSnapshot | null;
};

export type PostBodyAttrsSnapshot = {
  [key: string]: PostBodyAttrsValueSnapshot;
};
export type PostBodyContentSnapshot = PostBodySnapshot[];
export type PostBodyMarksSnapshot = PostBodySnapshot[];
export type PostBodySnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: PostBodyAttrsSnapshot;
  content: PostBodyContentSnapshot;
  text: string | null;
  marks: PostBodyMarksSnapshot;
};
export type PostInit = {
  id?: string;
  createdAt?: number;
  title: string;
  body?: PostBodyInit;
  coverImage?: File | null;
};

export type PostBodyAttrsInit = { [key: string]: PostBodyAttrsValueInit };
export type PostBodyContentInit = PostBodyInit[];
export type PostBodyMarksInit = PostBodyInit[];
export type PostBodyInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: PostBodyAttrsInit;
  content?: PostBodyContentInit;
  text?: string | null;
  marks?: PostBodyMarksInit;
};

export type MigrationTypes = {
  posts: { init: PostInit; snapshot: PostSnapshot };
};
