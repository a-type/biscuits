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
export type FloorLinesItemSnapshot = {
  start: FloorLinesItemStartSnapshot;
  end: FloorLinesPropertiesSnapshot;
};
export type FloorLinesSnapshot = FloorLinesItemSnapshot[];
export type FloorLabelsItemSnapshot = {
  position: FloorLinesPropertiesSnapshot;
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
export type FloorLinesItemInit = {
  start: FloorLinesItemStartInit;
  end: FloorLinesPropertiesInit;
};
export type FloorLinesInit = FloorLinesItemInit[];
export type FloorLabelsItemInit = {
  position: FloorLinesPropertiesInit;
  content: string;
};
export type FloorLabelsInit = FloorLabelsItemInit[];

export type MigrationTypes = {
  floors: { init: FloorInit; snapshot: FloorSnapshot };
};
