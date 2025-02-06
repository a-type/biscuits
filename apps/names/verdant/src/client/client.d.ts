/** Generated types for Verdant client */
import type {
  Client as BaseClient,
  ClientDescriptor as BaseClientDescriptor,
  ClientDescriptorOptions as BaseClientDescriptorOptions,
  CollectionQueries,
  StorageSchema,
  Migration,
} from "@verdant-web/store";
export * from "@verdant-web/store";

export class Client<Presence = any, Profile = any> {
  readonly people: CollectionQueries<Person, PersonInit, PersonFilter>;
  readonly relationships: CollectionQueries<
    Relationship,
    RelationshipInit,
    RelationshipFilter
  >;

  sync: BaseClient<Presence, Profile>["sync"];
  undoHistory: BaseClient<Presence, Profile>["undoHistory"];
  namespace: BaseClient<Presence, Profile>["namespace"];
  entities: BaseClient<Presence, Profile>["entities"];
  // queryStore: BaseClient<Presence, Profile>['queryStore'];
  batch: BaseClient<Presence, Profile>["batch"];
  // files: BaseClient<Presence, Profile>['files'];
  close: BaseClient<Presence, Profile>["close"];
  export: BaseClient<Presence, Profile>["export"];
  import: BaseClient<Presence, Profile>["import"];
  subscribe: BaseClient<Presence, Profile>["subscribe"];
  stats: BaseClient<Presence, Profile>["stats"];

  /**
   * Deletes all local data. If the client is connected to sync,
   * this will cause the client to re-sync all data from the server.
   * Use this very carefully, and only as a last resort.
   */
  __dangerous__resetLocal: BaseClient<
    Presence,
    Profile
  >["__dangerous__resetLocal"];

  /**
   * Export all data, then re-import it. This might resolve
   * some issues with the local database, but it should
   * only be done as a second-to-last resort. The last resort
   * would be __dangerous__resetLocal on ClientDescriptor, which
   * clears all local data.
   *
   * Unlike __dangerous__resetLocal, this method allows local-only
   * clients to recover data, whereas __dangerous__resetLocal only
   * lets networked clients recover from the server.
   */
  __dangerous__hardReset: () => Promise<void>;

  /**
   * Manually triggers storage rebasing. Follows normal
   * rebasing rules. Rebases already happen automatically
   * during normal operation, so you probably don't need this.
   */
  __manualRebase: () => Promise<void>;
}

export interface ClientDescriptorOptions<Presence = any, Profile = any>
  extends Omit<
    BaseClientDescriptorOptions<Presence, Profile>,
    "schema" | "migrations" | "oldSchemas"
  > {
  /** WARNING: overriding the schema is dangerous and almost definitely not what you want. */
  schema?: StorageSchema;
  /** WARNING: overriding old schemas is dangerous and almost definitely not what you want. */
  oldSchemas?: StorageSchema[];
  /** WARNING: overriding the migrations is dangerous and almost definitely not what you want. */
  migrations?: Migration[];
}

export class ClientDescriptor<Presence = any, Profile = any> {
  constructor(init: ClientDescriptorOptions<Presence, Profile>);
  open: () => Promise<Client<Presence, Profile>>;
  close: () => Promise<void>;
  readonly current: Client<Presence, Profile> | null;
  readonly readyPromise: Promise<Client<Presence, Profile>>;
  readonly schema: StorageSchema;
  readonly namespace: string;
  /**
   * Resets all local data for this client, including the schema and migrations.
   * If the client is not connected to sync, this causes the irretrievable loss of all data.
   * If the client is connected to sync, this will cause the client to re-sync all data from the server.
   * Use this very carefully, and only as a last resort.
   */
  __dangerous__resetLocal: () => Promise<void>;
}

import {
  ObjectEntity,
  ListEntity,
  EntityFile,
  EntityFileSnapshot,
} from "@verdant-web/store";

/** Generated types for Person */

export type Person = ObjectEntity<
  PersonInit,
  PersonDestructured,
  PersonSnapshot
>;
export type PersonId = string;
export type PersonCreatedAt = number;
export type PersonName = string;
export type PersonGeolocation = ObjectEntity<
  PersonGeolocationInit,
  PersonGeolocationDestructured,
  PersonGeolocationSnapshot
> | null;
export type PersonGeolocationLatitude = number;
export type PersonGeolocationLongitude = number;
export type PersonNote = string;
export type PersonPhoto = string | null;
export type PersonCreatedBy = string;
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
export type PersonDestructured = {
  id: string;
  createdAt: number;
  name: string;
  geolocation: PersonGeolocation;
  note: string | null;
  photo: EntityFile | null;
  createdBy: string | null;
};

export type PersonGeolocationDestructured = {
  latitude: number;
  longitude: number;
};
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

/** Index filters for Person **/

export interface PersonCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface PersonCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface PersonCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface PersonMatchTextSortFilter {
  where: "matchText";
  order: "asc" | "desc";
}
export interface PersonMatchTextMatchFilter {
  where: "matchText";
  equals: string;
  order?: "asc" | "desc";
}
export interface PersonMatchTextRangeFilter {
  where: "matchText";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface PersonMatchTextStartsWithFilter {
  where: "matchText";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface PersonMatchNameSortFilter {
  where: "matchName";
  order: "asc" | "desc";
}
export interface PersonMatchNameMatchFilter {
  where: "matchName";
  equals: string;
  order?: "asc" | "desc";
}
export interface PersonMatchNameRangeFilter {
  where: "matchName";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface PersonMatchNameStartsWithFilter {
  where: "matchName";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface PersonMatchNoteSortFilter {
  where: "matchNote";
  order: "asc" | "desc";
}
export interface PersonMatchNoteMatchFilter {
  where: "matchNote";
  equals: string;
  order?: "asc" | "desc";
}
export interface PersonMatchNoteRangeFilter {
  where: "matchNote";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface PersonMatchNoteStartsWithFilter {
  where: "matchNote";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface PersonLatitudeSortFilter {
  where: "latitude";
  order: "asc" | "desc";
}
export interface PersonLatitudeMatchFilter {
  where: "latitude";
  equals: number;
  order?: "asc" | "desc";
}
export interface PersonLatitudeRangeFilter {
  where: "latitude";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface PersonLongitudeSortFilter {
  where: "longitude";
  order: "asc" | "desc";
}
export interface PersonLongitudeMatchFilter {
  where: "longitude";
  equals: number;
  order?: "asc" | "desc";
}
export interface PersonLongitudeRangeFilter {
  where: "longitude";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type PersonFilter =
  | PersonCreatedAtSortFilter
  | PersonCreatedAtMatchFilter
  | PersonCreatedAtRangeFilter
  | PersonMatchTextSortFilter
  | PersonMatchTextMatchFilter
  | PersonMatchTextRangeFilter
  | PersonMatchTextStartsWithFilter
  | PersonMatchNameSortFilter
  | PersonMatchNameMatchFilter
  | PersonMatchNameRangeFilter
  | PersonMatchNameStartsWithFilter
  | PersonMatchNoteSortFilter
  | PersonMatchNoteMatchFilter
  | PersonMatchNoteRangeFilter
  | PersonMatchNoteStartsWithFilter
  | PersonLatitudeSortFilter
  | PersonLatitudeMatchFilter
  | PersonLatitudeRangeFilter
  | PersonLongitudeSortFilter
  | PersonLongitudeMatchFilter
  | PersonLongitudeRangeFilter;

/** Generated types for Relationship */

export type Relationship = ObjectEntity<
  RelationshipInit,
  RelationshipDestructured,
  RelationshipSnapshot
>;
export type RelationshipId = string;
export type RelationshipPersonAId = string;
export type RelationshipPersonALabel = string;
export type RelationshipPersonBId = string;
export type RelationshipPersonBLabel = string;
export type RelationshipInit = {
  id?: string;
  personAId: string;
  personALabel?: string | null;
  personBId: string;
  personBLabel?: string | null;
};

export type RelationshipDestructured = {
  id: string;
  personAId: string;
  personALabel: string | null;
  personBId: string;
  personBLabel: string | null;
};

export type RelationshipSnapshot = {
  id: string;
  personAId: string;
  personALabel: string | null;
  personBId: string;
  personBLabel: string | null;
};

/** Index filters for Relationship **/

export interface RelationshipPersonIdSortFilter {
  where: "personId";
  order: "asc" | "desc";
}
export interface RelationshipPersonIdMatchFilter {
  where: "personId";
  equals: string;
  order?: "asc" | "desc";
}
export interface RelationshipPersonIdRangeFilter {
  where: "personId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface RelationshipPersonIdStartsWithFilter {
  where: "personId";
  startsWith: string;
  order?: "asc" | "desc";
}
export type RelationshipFilter =
  | RelationshipPersonIdSortFilter
  | RelationshipPersonIdMatchFilter
  | RelationshipPersonIdRangeFilter
  | RelationshipPersonIdStartsWithFilter;
