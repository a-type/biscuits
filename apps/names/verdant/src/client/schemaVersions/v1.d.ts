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
};

export type PersonGeolocationSnapshot = {
  latitude: number;
  longitude: number;
} | null;
export type PersonInit = {
  id?: string;
  createdAt?: number;
  name: string;
  geolocation?: PersonGeolocationInit;
  note?: string | null;
  photo?: File | null;
  createdBy?: string | null;
};

export type PersonGeolocationInit = {
  latitude: number;
  longitude: number;
} | null;

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

export type MigrationTypes = {
  people: { init: PersonInit; snapshot: PersonSnapshot };
  relationships: { init: RelationshipInit; snapshot: RelationshipSnapshot };
};
