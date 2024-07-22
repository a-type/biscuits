import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type ProjectSnapshot = {
  id: string;
  createdAt: number;
  image: EntityFileSnapshot;
  colors: ProjectColorsSnapshot;
};

export type ProjectColorsItemPixelSnapshot = { x: number; y: number };
export type ProjectColorsItemPercentageSnapshot = { x: number; y: number };
export type ProjectColorsItemValueSnapshot = {
  r: number;
  g: number;
  b: number;
};
export type ProjectColorsItemSnapshot = {
  id: string;
  pixel: ProjectColorsItemPixelSnapshot;
  percentage: ProjectColorsItemPercentageSnapshot;
  value: ProjectColorsItemValueSnapshot;
};
export type ProjectColorsSnapshot = ProjectColorsItemSnapshot[];
export type ProjectInit = {
  id?: string;
  createdAt?: number;
  image: File;
  colors?: ProjectColorsInit;
};

export type ProjectColorsItemPixelInit = { x: number; y: number };
export type ProjectColorsItemPercentageInit = { x: number; y: number };
export type ProjectColorsItemValueInit = { r: number; g: number; b: number };
export type ProjectColorsItemInit = {
  id?: string;
  pixel: ProjectColorsItemPixelInit;
  percentage: ProjectColorsItemPercentageInit;
  value: ProjectColorsItemValueInit;
};
export type ProjectColorsInit = ProjectColorsItemInit[];

export type MigrationTypes = {
  projects: { init: ProjectInit; snapshot: ProjectSnapshot };
};
