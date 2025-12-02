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

export type FloorLinesItemStartSnapSnapshot = {
  lineId: string;
  side: "start" | "end";
};
export type FloorLinesItemStartSnapshot = {
  x: number;
  y: number;
  snap: FloorLinesItemStartSnapSnapshot | null;
};
export type FloorLinesItemEndSnapSnapshot = {
  lineId: string;
  side: "start" | "end";
};
export type FloorLinesItemEndSnapshot = {
  x: number;
  y: number;
  snap: FloorLinesItemEndSnapSnapshot | null;
};
export type FloorLinesItemAttachmentsItemSnapshot = {
  id: string;
  start: number;
  end: number;
  type: string;
  direction: "normal" | "reversed";
};
export type FloorLinesItemAttachmentsSnapshot =
  FloorLinesItemAttachmentsItemSnapshot[];
export type FloorLinesItemSnapshot = {
  id: string;
  start: FloorLinesItemStartSnapshot;
  end: FloorLinesItemEndSnapshot;
  attachments: FloorLinesItemAttachmentsSnapshot;
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

export type FloorLinesItemStartSnapInit = {
  lineId: string;
  side: "start" | "end";
};
export type FloorLinesItemStartInit = {
  x: number;
  y: number;
  snap?: FloorLinesItemStartSnapInit | null;
};
export type FloorLinesItemEndSnapInit = {
  lineId: string;
  side: "start" | "end";
};
export type FloorLinesItemEndInit = {
  x: number;
  y: number;
  snap?: FloorLinesItemEndSnapInit | null;
};
export type FloorLinesItemAttachmentsItemInit = {
  id?: string;
  start: number;
  end: number;
  type: string;
  direction: "normal" | "reversed";
};
export type FloorLinesItemAttachmentsInit = FloorLinesItemAttachmentsItemInit[];
export type FloorLinesItemInit = {
  id?: string;
  start: FloorLinesItemStartInit;
  end: FloorLinesItemEndInit;
  attachments?: FloorLinesItemAttachmentsInit;
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
