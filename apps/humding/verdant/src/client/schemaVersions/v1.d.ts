import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type SongSnapshot = {
  id: string;
  createdAt: number;
  title: string;
  lines: SongLinesSnapshot;
};

export type SongLinesItemWordsItemSnapshot = { text: string; gap: number };
export type SongLinesItemWordsSnapshot = SongLinesItemWordsItemSnapshot[];
export type SongLinesItemChordsItemSnapshot = { value: string; gap: number };
export type SongLinesItemChordsSnapshot = SongLinesItemChordsItemSnapshot[];
export type SongLinesItemSnapshot = {
  words: SongLinesItemWordsSnapshot;
  chords: SongLinesItemChordsSnapshot;
};
export type SongLinesSnapshot = SongLinesItemSnapshot[];
export type SongInit = {
  id?: string;
  createdAt?: number;
  title: string;
  lines?: SongLinesInit;
};

export type SongLinesItemWordsItemInit = { text: string; gap: number };
export type SongLinesItemWordsInit = SongLinesItemWordsItemInit[];
export type SongLinesItemChordsItemInit = { value: string; gap: number };
export type SongLinesItemChordsInit = SongLinesItemChordsItemInit[];
export type SongLinesItemInit = {
  words?: SongLinesItemWordsInit;
  chords?: SongLinesItemChordsInit;
};
export type SongLinesInit = SongLinesItemInit[];

export type MigrationTypes = {
  songs: { init: SongInit; snapshot: SongSnapshot };
};
