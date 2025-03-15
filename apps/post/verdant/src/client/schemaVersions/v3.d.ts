import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type PostSnapshot = {
  id: string;
  createdAt: number;
  title: string;
  body: PostBodySnapshot;
  summary: string | null;
  coverImage: EntityFileSnapshot | null;
  notebookId: string | null;
};

export type PostBodyAttrsSnapshot = {
  [key: string]: PostBodyAttrsValueSnapshot;
};
export type PostBodyContentItemAttrsSnapshot = {
  [key: string]: PostBodyContentItemAttrsValueSnapshot;
};
export type PostBodyContentItemContentSnapshot =
  | PostBodyContentSnapshot[]
  | null;
export type PostBodyContentItemMarksSnapshot = PostBodyContentSnapshot[] | null;
export type PostBodyContentItemSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: PostBodyContentItemAttrsSnapshot;
  content: PostBodyContentItemContentSnapshot | null;
  text: string | null;
  marks: PostBodyContentItemMarksSnapshot | null;
};
export type PostBodyContentSnapshot = PostBodyContentItemSnapshot[] | null;
export type PostBodyMarksSnapshot = PostBodyContentSnapshot[] | null;
export type PostBodySnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: PostBodyAttrsSnapshot;
  content: PostBodyContentSnapshot | null;
  text: string | null;
  marks: PostBodyMarksSnapshot | null;
};
export type PostInit = {
  id?: string;
  createdAt?: number;
  title: string;
  body?: PostBodyInit;
  summary?: string | null;
  coverImage?: File | null;
  notebookId?: string | null;
};

export type PostBodyAttrsInit = { [key: string]: PostBodyAttrsValueInit };
export type PostBodyContentItemAttrsInit = {
  [key: string]: PostBodyContentItemAttrsValueInit;
};
export type PostBodyContentItemContentInit = PostBodyContentInit[] | null;
export type PostBodyContentItemMarksInit = PostBodyContentInit[] | null;
export type PostBodyContentItemInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: PostBodyContentItemAttrsInit;
  content?: PostBodyContentItemContentInit | null;
  text?: string | null;
  marks?: PostBodyContentItemMarksInit | null;
};
export type PostBodyContentInit = PostBodyContentItemInit[] | null;
export type PostBodyMarksInit = PostBodyContentInit[] | null;
export type PostBodyInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: PostBodyAttrsInit;
  content?: PostBodyContentInit | null;
  text?: string | null;
  marks?: PostBodyMarksInit | null;
};

export type NotebookSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  coverImage: EntityFileSnapshot | null;
  icon: EntityFileSnapshot | null;
  description: NotebookDescriptionSnapshot;
  theme: string | null;
  font: string | null;
};

export type NotebookDescriptionAttrsSnapshot = {
  [key: string]: NotebookDescriptionAttrsValueSnapshot;
};
export type NotebookDescriptionContentItemAttrsSnapshot = {
  [key: string]: NotebookDescriptionContentItemAttrsValueSnapshot;
};
export type NotebookDescriptionContentItemContentSnapshot =
  | NotebookDescriptionContentSnapshot[]
  | null;
export type NotebookDescriptionContentItemMarksSnapshot =
  | NotebookDescriptionContentSnapshot[]
  | null;
export type NotebookDescriptionContentItemSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: NotebookDescriptionContentItemAttrsSnapshot;
  content: NotebookDescriptionContentItemContentSnapshot | null;
  text: string | null;
  marks: NotebookDescriptionContentItemMarksSnapshot | null;
};
export type NotebookDescriptionContentSnapshot =
  | NotebookDescriptionContentItemSnapshot[]
  | null;
export type NotebookDescriptionMarksSnapshot =
  | NotebookDescriptionContentSnapshot[]
  | null;
export type NotebookDescriptionSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: NotebookDescriptionAttrsSnapshot;
  content: NotebookDescriptionContentSnapshot | null;
  text: string | null;
  marks: NotebookDescriptionMarksSnapshot | null;
};
export type NotebookInit = {
  id?: string;
  createdAt?: number;
  name: string;
  coverImage?: File | null;
  icon?: File | null;
  description?: NotebookDescriptionInit;
  theme?: string | null;
  font?: string | null;
};

export type NotebookDescriptionAttrsInit = {
  [key: string]: NotebookDescriptionAttrsValueInit;
};
export type NotebookDescriptionContentItemAttrsInit = {
  [key: string]: NotebookDescriptionContentItemAttrsValueInit;
};
export type NotebookDescriptionContentItemContentInit =
  | NotebookDescriptionContentInit[]
  | null;
export type NotebookDescriptionContentItemMarksInit =
  | NotebookDescriptionContentInit[]
  | null;
export type NotebookDescriptionContentItemInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: NotebookDescriptionContentItemAttrsInit;
  content?: NotebookDescriptionContentItemContentInit | null;
  text?: string | null;
  marks?: NotebookDescriptionContentItemMarksInit | null;
};
export type NotebookDescriptionContentInit =
  | NotebookDescriptionContentItemInit[]
  | null;
export type NotebookDescriptionMarksInit =
  | NotebookDescriptionContentInit[]
  | null;
export type NotebookDescriptionInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: NotebookDescriptionAttrsInit;
  content?: NotebookDescriptionContentInit | null;
  text?: string | null;
  marks?: NotebookDescriptionMarksInit | null;
};

export type MigrationTypes = {
  posts: { init: PostInit; snapshot: PostSnapshot };
  notebooks: { init: NotebookInit; snapshot: NotebookSnapshot };
};
