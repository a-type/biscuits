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
  /** Collection access for Person. Load queries, put and delete documents. */
  readonly people: CollectionQueries<Person, PersonInit, PersonFilter>;

  /** Collection access for Relationship. Load queries, put and delete documents. */
  readonly relationships: CollectionQueries<
    Relationship,
    RelationshipInit,
    RelationshipFilter
  >;

  /** Collection access for Tag. Load queries, put and delete documents. */
  readonly tags: CollectionQueries<Tag, TagInit, TagFilter>;

  /**
   * Turn on and off sync, or adjust the sync protocol and other settings.
   */
  sync: BaseClient<Presence, Profile>["sync"];
  /**
   * Access and manipulate the undo/redo stack. You can also
   * add custom undoable actions using addUndo, although the interface
   * for doing this is pretty mind-bending at the moment (sorry).
   */
  undoHistory: BaseClient<Presence, Profile>["undoHistory"];
  /**
   * The namespace used to construct this store.
   */
  namespace: BaseClient<Presence, Profile>["namespace"];
  /**
   * @deprecated - do not use this. For batching, use .batch instead.
   * Using methods on this property can cause data loss and corruption.
   */
  entities: BaseClient<Presence, Profile>["entities"];
  /**
   * Tools for batching operations so they are bundled together
   * in the undo/redo stack.
   */
  batch: BaseClient<Presence, Profile>["batch"];
  close: BaseClient<Presence, Profile>["close"];
  /**
   * Export a backup of a full library
   */
  export: BaseClient<Presence, Profile>["export"];
  /**
   * Import a full library from a backup. WARNING: this replaces
   * existing data with no option for restore.
   */
  import: BaseClient<Presence, Profile>["import"];
  /**
   * Subscribe to global store events
   */
  subscribe: BaseClient<Presence, Profile>["subscribe"];
  /**
   * Read stats about storage usage
   */
  stats: BaseClient<Presence, Profile>["stats"];
  /**
   * An interface for inspecting and manipulating active live queries.
   * Particularly, see .keepAlive and .dropKeepAlive for placing keep-alive
   * holds to keep query results in memory when unsubscribed.
   */
  queries: BaseClient<Presence, Profile>["queries"];

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
>;
export type PersonGeolocationLatitude = number;
export type PersonGeolocationLongitude = number;
export type PersonGeolocationLabel = string;
export type PersonNote = string;
export type PersonPhoto = EntityFile;
export type PersonCreatedBy = string;
export type PersonTags = ListEntity<
  PersonTagsInit,
  PersonTagsDestructured,
  PersonTagsSnapshot
>;
export type PersonTagsItem = string;
export type PersonDismissedSuggestions = ListEntity<
  PersonDismissedSuggestionsInit,
  PersonDismissedSuggestionsDestructured,
  PersonDismissedSuggestionsSnapshot
>;
export type PersonDismissedSuggestionsItem = string;
export type PersonInit = {
  id?: string;
  createdAt?: number;
  name: string;
  geolocation?: PersonGeolocationInit | null;
  note?: string | null;
  photo?: File | null;
  createdBy?: string | null;
  tags?: PersonTagsInit;
  dismissedSuggestions?: PersonDismissedSuggestionsInit;
};

export type PersonGeolocationInit = {
  latitude: number;
  longitude: number;
  label?: string | null;
};
export type PersonTagsInit = string[];
export type PersonDismissedSuggestionsInit = string[];
export type PersonDestructured = {
  id: string;
  createdAt: number;
  name: string;
  geolocation: PersonGeolocation | null;
  note: string | null;
  photo: EntityFile | null;
  createdBy: string | null;
  tags: PersonTags;
  dismissedSuggestions: PersonDismissedSuggestions;
};

export type PersonGeolocationDestructured = {
  latitude: number;
  longitude: number;
  label: string | null;
};
export type PersonTagsDestructured = string[];
export type PersonDismissedSuggestionsDestructured = string[];
export type PersonSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  geolocation: PersonGeolocationSnapshot | null;
  note: string | null;
  photo: EntityFileSnapshot | null;
  createdBy: string | null;
  tags: PersonTagsSnapshot;
  dismissedSuggestions: PersonDismissedSuggestionsSnapshot;
};

export type PersonGeolocationSnapshot = {
  latitude: number;
  longitude: number;
  label: string | null;
};
export type PersonTagsSnapshot = string[];
export type PersonDismissedSuggestionsSnapshot = string[];

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
export interface PersonMatchLocationSortFilter {
  where: "matchLocation";
  order: "asc" | "desc";
}
export interface PersonMatchLocationMatchFilter {
  where: "matchLocation";
  equals: string;
  order?: "asc" | "desc";
}
export interface PersonMatchLocationRangeFilter {
  where: "matchLocation";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface PersonMatchLocationStartsWithFilter {
  where: "matchLocation";
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
export interface PersonTagsSortFilter {
  where: "tags";
  order: "asc" | "desc";
}
export interface PersonTagsMatchFilter {
  where: "tags";
  equals: string;
  order?: "asc" | "desc";
}
export interface PersonTagsRangeFilter {
  where: "tags";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface PersonTagsStartsWithFilter {
  where: "tags";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface PersonTagCreatedAtCompoundFilter {
  where: "tag_createdAt";
  match: {
    tags: string;
    createdAt?: number;
  };
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
  | PersonMatchLocationSortFilter
  | PersonMatchLocationMatchFilter
  | PersonMatchLocationRangeFilter
  | PersonMatchLocationStartsWithFilter
  | PersonLatitudeSortFilter
  | PersonLatitudeMatchFilter
  | PersonLatitudeRangeFilter
  | PersonLongitudeSortFilter
  | PersonLongitudeMatchFilter
  | PersonLongitudeRangeFilter
  | PersonTagsSortFilter
  | PersonTagsMatchFilter
  | PersonTagsRangeFilter
  | PersonTagsStartsWithFilter
  | PersonTagCreatedAtCompoundFilter;

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

/** Generated types for Tag */

export type Tag = ObjectEntity<TagInit, TagDestructured, TagSnapshot>;
export type TagName = string;
export type TagColor = string;
export type TagIcon = string;
export type TagInit = {
  name: string;
  color?: string | null;
  icon?: string | null;
};

export type TagDestructured = {
  name: string;
  color: string | null;
  icon: string | null;
};

export type TagSnapshot = {
  name: string;
  color: string | null;
  icon: string | null;
};

/** Index filters for Tag **/

export type TagFilter = never;
