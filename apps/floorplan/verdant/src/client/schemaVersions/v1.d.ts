import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type FloorSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  lines: FloorLinesSnapshot;
  labels: FloorLabelsSnapshot;
};

export type FloorLinesItemStartSnapshot = { x: number; y: number };
export type FloorLinesItemEndSnapshot = { x: number; y: number };
export type FloorLinesItemSnapshot = {
  id: string;
  start: FloorLinesItemStartSnapshot;
  end: FloorLinesItemEndSnapshot;
};
export type FloorLinesSnapshot = FloorLinesItemSnapshot[];
export type FloorLabelsItemPositionSnapshot = { x: number; y: number };
export type FloorLabelsItemSnapshot = {
  id: string;
  position: FloorLabelsItemPositionSnapshot;
  content: string;
};
export type FloorLabelsSnapshot = FloorLabelsItemSnapshot[];
export type FloorInit = {
  id?: string;
  createdAt?: number;
  name: string;
  lines?: FloorLinesInit;
  labels?: FloorLabelsInit;
};

export type FloorLinesItemStartInit = { x: number; y: number };
export type FloorLinesItemEndInit = { x: number; y: number };
export type FloorLinesItemInit = {
  id?: string;
  start: FloorLinesItemStartInit;
  end: FloorLinesItemEndInit;
};
export type FloorLinesInit = FloorLinesItemInit[];
export type FloorLabelsItemPositionInit = { x: number; y: number };
export type FloorLabelsItemInit = {
  id?: string;
  position: FloorLabelsItemPositionInit;
  content: string;
};
export type FloorLabelsInit = FloorLabelsItemInit[];

export type MigrationTypes = {
  floors: { init: FloorInit; snapshot: FloorSnapshot };
};
