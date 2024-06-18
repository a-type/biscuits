import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type SongSnapshot = {
  id: string;
  createdAt: number;
  title: string;
  lines: SongLinesSnapshot;
};

export type SongLinesItemWordsItemChordsItemSnapshot = {
  id: string;
  value: string;
  offset: number;
};
export type SongLinesItemWordsItemChordsSnapshot =
  SongLinesItemWordsItemChordsItemSnapshot[];
export type SongLinesItemWordsItemSnapshot = {
  id: string;
  text: string;
  gapStart: number;
  chords: SongLinesItemWordsItemChordsSnapshot;
};
export type SongLinesItemWordsSnapshot = SongLinesItemWordsItemSnapshot[];
export type SongLinesItemSnapshot = { words: SongLinesItemWordsSnapshot };
export type SongLinesSnapshot = SongLinesItemSnapshot[];
export type SongInit = {
  id?: string;
  createdAt?: number;
  title: string;
  lines?: SongLinesInit;
};

export type SongLinesItemWordsItemChordsItemInit = {
  id?: string;
  value?: string;
  offset?: number;
};
export type SongLinesItemWordsItemChordsInit =
  SongLinesItemWordsItemChordsItemInit[];
export type SongLinesItemWordsItemInit = {
  id?: string;
  text?: string;
  gapStart?: number;
  chords?: SongLinesItemWordsItemChordsInit;
};
export type SongLinesItemWordsInit = SongLinesItemWordsItemInit[];
export type SongLinesItemInit = { words?: SongLinesItemWordsInit };
export type SongLinesInit = SongLinesItemInit[];

export type MigrationTypes = {
  songs: { init: SongInit; snapshot: SongSnapshot };
};
