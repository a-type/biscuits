import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type EntrySnapshot = {
  id: string;
  createdAt: number;
  createdBy: string | null;
  value: number | null;
  tags: EntryTagsSnapshot;
  weather: EntryWeatherSnapshot | null;
};

export type EntryTagsSnapshot = string[];
export type EntryWeatherSnapshot = {
  unit: "F" | "C" | "K";
  high: number | null;
  low: number | null;
  precipitationMM: number | null;
};
export type EntryInit = {
  id?: string;
  createdAt?: number;
  createdBy?: string | null;
  value?: number | null;
  tags?: EntryTagsInit;
  weather?: EntryWeatherInit | null;
};

export type EntryTagsInit = string[];
export type EntryWeatherInit = {
  unit: "F" | "C" | "K";
  high?: number | null;
  low?: number | null;
  precipitationMM?: number | null;
};

export type TagMetadataSnapshot = {
  id: string;
  value: string;
  createdAt: number;
  lastUsedAt: number;
  useCount: number;
  color: string | null;
};
export type TagMetadataInit = {
  id?: string;
  value: string;
  createdAt?: number;
  lastUsedAt?: number;
  useCount?: number;
  color?: string | null;
};

export type MigrationTypes = {
  entries: { init: EntryInit; snapshot: EntrySnapshot };
  tagMetadata: { init: TagMetadataInit; snapshot: TagMetadataSnapshot };
};
