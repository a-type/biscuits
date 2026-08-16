import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type TaskSnapshot = {
  id: string;
  title: string;
  details: string | null;
  createdAt: number;
  recurrence: TaskRecurrenceSnapshot | null;
  completions: TaskCompletionsSnapshot;
  blocks: TaskBlocksSnapshot;
  scale: number | null;
};

export type TaskRecurrenceSnapshot = {
  interval: number;
  unit: "day" | "week" | "month" | "year";
};
export type TaskCompletionsItemSnapshot = {
  id: string;
  completedAt: number;
  completedBy: string | null;
};
export type TaskCompletionsSnapshot = TaskCompletionsItemSnapshot[];
export type TaskBlocksSnapshot = string[];
export type TaskInit = {
  id?: string;
  title?: string;
  details?: string | null;
  createdAt?: number;
  recurrence?: TaskRecurrenceInit | null;
  completions?: TaskCompletionsInit;
  blocks?: TaskBlocksInit;
  scale?: number | null;
};

export type TaskRecurrenceInit = {
  interval?: number;
  unit?: "day" | "week" | "month" | "year";
};
export type TaskCompletionsItemInit = {
  id?: string;
  completedAt?: number;
  completedBy?: string | null;
};
export type TaskCompletionsInit = TaskCompletionsItemInit[];
export type TaskBlocksInit = string[];

export type PlaylistSnapshot = {
  id: string;
  name: string;
  items: PlaylistItemsSnapshot;
};

export type PlaylistItemsSnapshot = string[];
export type PlaylistInit = {
  id?: string;
  name?: string;
  items?: PlaylistItemsInit;
};

export type PlaylistItemsInit = string[];

export type MigrationTypes = {
  tasks: { init: TaskInit; snapshot: TaskSnapshot };
  playlists: { init: PlaylistInit; snapshot: PlaylistSnapshot };
};
