import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type FloorSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  lines: FloorLinesSnapshot;
  shapes: FloorShapesSnapshot;
  labels: FloorLabelsSnapshot;
};

export type FloorLinesValueStartSnapSnapshot = {
  lineId: string;
  side: "start" | "end";
  offset: number;
};
export type FloorLinesValueStartSnapshot = {
  x: number;
  y: number;
  snap: FloorLinesValueStartSnapSnapshot | null;
};
export type FloorLinesValueSnapshot = {
  id: string;
  start: FloorLinesValueStartSnapshot;
  end: FloorLinesValuePropertiesSnapshot;
};
export type FloorLinesSnapshot = { [key: string]: FloorLinesValueSnapshot };
export type FloorShapesValueSnapshot = {
  id: string;
  center: FloorLinesValuePropertiesSnapshot;
  width: number;
  height: number;
  angle: number;
  type: "ellipse" | "rectangle";
};
export type FloorShapesSnapshot = { [key: string]: FloorShapesValueSnapshot };
export type FloorLabelsValueSnapshot = {
  id: string;
  center: FloorLinesValuePropertiesSnapshot;
  content: string;
};
export type FloorLabelsSnapshot = { [key: string]: FloorLabelsValueSnapshot };
export type FloorInit = {
  id?: string;
  createdAt?: number;
  name: string;
  lines?: FloorLinesInit;
  shapes?: FloorShapesInit;
  labels?: FloorLabelsInit;
};

export type FloorLinesValueStartSnapInit = {
  lineId: string;
  side: "start" | "end";
  offset?: number;
};
export type FloorLinesValueStartInit = {
  x: number;
  y: number;
  snap?: FloorLinesValueStartSnapInit | null;
};
export type FloorLinesValueInit = {
  id?: string;
  start: FloorLinesValueStartInit;
  end: FloorLinesValuePropertiesInit;
};
export type FloorLinesInit = { [key: string]: FloorLinesValueInit };
export type FloorShapesValueInit = {
  id?: string;
  center: FloorLinesValuePropertiesInit;
  width: number;
  height: number;
  angle?: number;
  type?: "ellipse" | "rectangle";
};
export type FloorShapesInit = { [key: string]: FloorShapesValueInit };
export type FloorLabelsValueInit = {
  id?: string;
  center: FloorLinesValuePropertiesInit;
  content: string;
};
export type FloorLabelsInit = { [key: string]: FloorLabelsValueInit };

export type MigrationTypes = {
  floors: { init: FloorInit; snapshot: FloorSnapshot };
};
