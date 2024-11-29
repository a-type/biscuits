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
  relationships: PersonRelationshipsSnapshot;
};

export type PersonGeolocationSnapshot = {
  latitude: number;
  longitude: number;
} | null;
export type PersonRelationshipsItemSnapshot = {
  personId: string;
  type: string;
};
export type PersonRelationshipsSnapshot = PersonRelationshipsItemSnapshot[];
export type PersonInit = {
  id?: string;
  createdAt?: number;
  name: string;
  geolocation?: PersonGeolocationInit;
  note?: string | null;
  photo?: File | null;
  relationships?: PersonRelationshipsInit;
};

export type PersonGeolocationInit = {
  latitude: number;
  longitude: number;
} | null;
export type PersonRelationshipsItemInit = { personId: string; type: string };
export type PersonRelationshipsInit = PersonRelationshipsItemInit[];

export type MigrationTypes = {
  people: { init: PersonInit; snapshot: PersonSnapshot };
};
