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
  /** Collection access for Post. Load queries, put and delete documents. */
  readonly posts: CollectionQueries<Post, PostInit, PostFilter>;

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

/** Generated types for Post */

export type Post = ObjectEntity<PostInit, PostDestructured, PostSnapshot>;
export type PostId = string;
export type PostCreatedAt = number;
export type PostTitle = string;
export type PostBody = ObjectEntity<
  PostBodyInit,
  PostBodyDestructured,
  PostBodySnapshot
>;
export type PostBodyType = string;
export type PostBodyFrom = number;
export type PostBodyTo = number;
export type PostBodyAttrs = ObjectEntity<
  PostBodyAttrsInit,
  PostBodyAttrsDestructured,
  PostBodyAttrsSnapshot
>;
export type PostBodyAttrsValue = any;
export type PostBodyContent = ListEntity<
  PostBodyContentInit,
  PostBodyContentDestructured,
  PostBodyContentSnapshot
>;

export type PostBodyText = string;
export type PostBodyMarks = ListEntity<
  PostBodyMarksInit,
  PostBodyMarksDestructured,
  PostBodyMarksSnapshot
>;
export type PostCoverImage = EntityFile;
export type PostInit = {
  id?: string;
  createdAt?: number;
  title: string;
  body?: PostBodyInit;
  coverImage?: File | null;
};

export type PostBodyAttrsInit = { [key: string]: PostBodyAttrsValueInit };
export type PostBodyContentInit = PostBodyInit[];
export type PostBodyMarksInit = PostBodyInit[];
export type PostBodyInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: PostBodyAttrsInit;
  content?: PostBodyContentInit;
  text?: string | null;
  marks?: PostBodyMarksInit;
};
export type PostDestructured = {
  id: string;
  createdAt: number;
  title: string;
  body: PostBody;
  coverImage: EntityFile | null;
};

export type PostBodyAttrsDestructured = {
  [key: string]: PostBodyAttrsValue | undefined;
};
export type PostBodyContentDestructured = PostBodyDestructured[];
export type PostBodyMarksDestructured = PostBodyDestructured[];
export type PostBodyDestructured = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: PostBodyAttrs;
  content: PostBodyContent;
  text: string | null;
  marks: PostBodyMarks;
};
export type PostSnapshot = {
  id: string;
  createdAt: number;
  title: string;
  body: PostBodySnapshot;
  coverImage: EntityFileSnapshot | null;
};

export type PostBodyAttrsSnapshot = {
  [key: string]: PostBodyAttrsValueSnapshot;
};
export type PostBodyContentSnapshot = PostBodySnapshot[];
export type PostBodyMarksSnapshot = PostBodySnapshot[];
export type PostBodySnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: PostBodyAttrsSnapshot;
  content: PostBodyContentSnapshot;
  text: string | null;
  marks: PostBodyMarksSnapshot;
};

/** Index filters for Post **/

export interface PostCreatedAtSortFilter {
  where: "createdAt";
  order: "asc" | "desc";
}
export interface PostCreatedAtMatchFilter {
  where: "createdAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface PostCreatedAtRangeFilter {
  where: "createdAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type PostFilter =
  | PostCreatedAtSortFilter
  | PostCreatedAtMatchFilter
  | PostCreatedAtRangeFilter;
