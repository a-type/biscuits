import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type PersonSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  geolocation: PersonGeolocationSnapshot;
  note: string | null;
  photo: EntityFileSnapshot | null;
  createdBy: string | null;
  tags: PersonTagsSnapshot;
};

export type PersonGeolocationSnapshot = {
  latitude: number;
  longitude: number;
} | null;
export type PersonTagsSnapshot = string[];
export type PersonInit = {
  id?: string;
  createdAt?: number;
  name: string;
  geolocation?: PersonGeolocationInit;
  note?: string | null;
  photo?: File | null;
  createdBy?: string | null;
  tags?: PersonTagsInit;
};

export type PersonGeolocationInit = {
  latitude: number;
  longitude: number;
} | null;
export type PersonTagsInit = string[];

export type RelationshipSnapshot = {
  id: string;
  personAId: string;
  personALabel: string | null;
  personBId: string;
  personBLabel: string | null;
};
export type RelationshipInit = {
  id?: string;
  personAId: string;
  personALabel?: string | null;
  personBId: string;
  personBLabel?: string | null;
};

export type TagSnapshot = {
  name: string;
  color: string | null;
  icon: string | null;
};
export type TagInit = {
  name: string;
  color?: string | null;
  icon?: string | null;
};

export type MigrationTypes = {
  people: { init: PersonInit; snapshot: PersonSnapshot };
  relationships: { init: RelationshipInit; snapshot: RelationshipSnapshot };
  tags: { init: TagInit; snapshot: TagSnapshot };
};
