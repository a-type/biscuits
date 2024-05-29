import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type AnnotationSnapshot = {
  id: string;
  content: string;
  createdAt: number;
  book: string;
  start: AnnotationStartSnapshot;
  end: AnnotationEndSnapshot;
};

export type AnnotationStartSnapshot = { chapter: number; verse: number };
export type AnnotationEndSnapshot = { chapter: number; verse: number };
export type AnnotationInit = {
  id?: string;
  content?: string;
  createdAt?: number;
  book: string;
  start: AnnotationStartInit;
  end: AnnotationEndInit;
};

export type AnnotationStartInit = { chapter: number; verse: number };
export type AnnotationEndInit = { chapter: number; verse: number };

export type MigrationTypes = {
  annotations: { init: AnnotationInit; snapshot: AnnotationSnapshot };
};
