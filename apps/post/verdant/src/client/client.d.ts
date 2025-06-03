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

  /** Collection access for Notebook. Load queries, put and delete documents. */
  readonly notebooks: CollectionQueries<Notebook, NotebookInit, NotebookFilter>;

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
export type PostBodyContentItem = ObjectEntity<
  PostBodyContentItemInit,
  PostBodyContentItemDestructured,
  PostBodyContentItemSnapshot
>;
export type PostBodyContentItemType = string;
export type PostBodyContentItemFrom = number;
export type PostBodyContentItemTo = number;
export type PostBodyContentItemAttrs = ObjectEntity<
  PostBodyContentItemAttrsInit,
  PostBodyContentItemAttrsDestructured,
  PostBodyContentItemAttrsSnapshot
>;
export type PostBodyContentItemAttrsValue = any;
export type PostBodyContentItemContent = ListEntity<
  PostBodyContentItemContentInit,
  PostBodyContentItemContentDestructured,
  PostBodyContentItemContentSnapshot
>;

export type PostBodyContentItemText = string;
export type PostBodyContentItemMarks = ListEntity<
  PostBodyContentItemMarksInit,
  PostBodyContentItemMarksDestructured,
  PostBodyContentItemMarksSnapshot
>;

export type PostBodyText = string;
export type PostBodyMarks = ListEntity<
  PostBodyMarksInit,
  PostBodyMarksDestructured,
  PostBodyMarksSnapshot
>;
export type PostFiles = ObjectEntity<
  PostFilesInit,
  PostFilesDestructured,
  PostFilesSnapshot
>;
export type PostFilesValue = EntityFile;
export type PostSummary = string;
export type PostCoverImage = EntityFile;
/** The ID of the notebook this post belongs to, if any. If null, the post is not in a notebook. */
export type PostNotebookId = string;
export type PostInit = {
  id?: string;
  createdAt?: number;
  title: string;
  body?: PostBodyInit;
  files?: PostFilesInit;
  summary?: string | null;
  coverImage?: File | null;
  notebookId?: string | null;
};

export type PostBodyAttrsInit = { [key: string]: PostBodyAttrsValueInit };
export type PostBodyContentItemAttrsInit = {
  [key: string]: PostBodyContentItemAttrsValueInit;
};
export type PostBodyContentItemContentInit = PostBodyContentInit[] | null;
export type PostBodyContentItemMarksInit = PostBodyContentInit[] | null;
export type PostBodyContentItemInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: PostBodyContentItemAttrsInit;
  content?: PostBodyContentItemContentInit | null;
  text?: string | null;
  marks?: PostBodyContentItemMarksInit | null;
};
export type PostBodyContentInit = PostBodyContentItemInit[] | null;
export type PostBodyMarksInit = PostBodyContentInit[] | null;
export type PostBodyInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: PostBodyAttrsInit;
  content?: PostBodyContentInit | null;
  text?: string | null;
  marks?: PostBodyMarksInit | null;
};
export type PostFilesInit = { [key: string]: PostFilesValueInit };
export type PostDestructured = {
  id: string;
  createdAt: number;
  title: string;
  body: PostBody;
  files: PostFiles;
  summary: string | null;
  coverImage: EntityFile | null;
  notebookId: string | null;
};

export type PostBodyAttrsDestructured = {
  [key: string]: PostBodyAttrsValue | undefined;
};
export type PostBodyContentItemAttrsDestructured = {
  [key: string]: PostBodyContentItemAttrsValue | undefined;
};
export type PostBodyContentItemContentDestructured = PostBodyContent[];
export type PostBodyContentItemMarksDestructured = PostBodyContent[];
export type PostBodyContentItemDestructured = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: PostBodyContentItemAttrs;
  content: PostBodyContentItemContent | null;
  text: string | null;
  marks: PostBodyContentItemMarks | null;
};
export type PostBodyContentDestructured = PostBodyContentItem[];
export type PostBodyMarksDestructured = PostBodyContent[];
export type PostBodyDestructured = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: PostBodyAttrs;
  content: PostBodyContent | null;
  text: string | null;
  marks: PostBodyMarks | null;
};
export type PostFilesDestructured = {
  [key: string]: PostFilesValue | undefined;
};
export type PostSnapshot = {
  id: string;
  createdAt: number;
  title: string;
  body: PostBodySnapshot;
  files: PostFilesSnapshot;
  summary: string | null;
  coverImage: EntityFileSnapshot | null;
  notebookId: string | null;
};

export type PostBodyAttrsSnapshot = {
  [key: string]: PostBodyAttrsValueSnapshot;
};
export type PostBodyContentItemAttrsSnapshot = {
  [key: string]: PostBodyContentItemAttrsValueSnapshot;
};
export type PostBodyContentItemContentSnapshot =
  | PostBodyContentSnapshot[]
  | null;
export type PostBodyContentItemMarksSnapshot = PostBodyContentSnapshot[] | null;
export type PostBodyContentItemSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: PostBodyContentItemAttrsSnapshot;
  content: PostBodyContentItemContentSnapshot | null;
  text: string | null;
  marks: PostBodyContentItemMarksSnapshot | null;
};
export type PostBodyContentSnapshot = PostBodyContentItemSnapshot[] | null;
export type PostBodyMarksSnapshot = PostBodyContentSnapshot[] | null;
export type PostBodySnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: PostBodyAttrsSnapshot;
  content: PostBodyContentSnapshot | null;
  text: string | null;
  marks: PostBodyMarksSnapshot | null;
};
export type PostFilesSnapshot = { [key: string]: PostFilesValueSnapshot };

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
export interface PostNotebookIdSortFilter {
  where: "notebookId";
  order: "asc" | "desc";
}
export interface PostNotebookIdMatchFilter {
  where: "notebookId";
  equals: string;
  order?: "asc" | "desc";
}
export interface PostNotebookIdRangeFilter {
  where: "notebookId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface PostNotebookIdStartsWithFilter {
  where: "notebookId";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface PostNotebookIdCreatedAtCompoundFilter {
  where: "notebookId_createdAt";
  match: {
    notebookId: string | null;
    createdAt?: number;
  };
  order?: "asc" | "desc";
}
export type PostFilter =
  | PostCreatedAtSortFilter
  | PostCreatedAtMatchFilter
  | PostCreatedAtRangeFilter
  | PostNotebookIdSortFilter
  | PostNotebookIdMatchFilter
  | PostNotebookIdRangeFilter
  | PostNotebookIdStartsWithFilter
  | PostNotebookIdCreatedAtCompoundFilter;

/** Generated types for Notebook */

export type Notebook = ObjectEntity<
  NotebookInit,
  NotebookDestructured,
  NotebookSnapshot
>;
export type NotebookId = string;
export type NotebookCreatedAt = number;
export type NotebookName = string;
export type NotebookCoverImage = EntityFile;
export type NotebookIcon = EntityFile;
export type NotebookPublishedTitle = string;
export type NotebookDescription = ObjectEntity<
  NotebookDescriptionInit,
  NotebookDescriptionDestructured,
  NotebookDescriptionSnapshot
>;
export type NotebookDescriptionType = string;
export type NotebookDescriptionFrom = number;
export type NotebookDescriptionTo = number;
export type NotebookDescriptionAttrs = ObjectEntity<
  NotebookDescriptionAttrsInit,
  NotebookDescriptionAttrsDestructured,
  NotebookDescriptionAttrsSnapshot
>;
export type NotebookDescriptionAttrsValue = any;
export type NotebookDescriptionContent = ListEntity<
  NotebookDescriptionContentInit,
  NotebookDescriptionContentDestructured,
  NotebookDescriptionContentSnapshot
>;
export type NotebookDescriptionContentItem = ObjectEntity<
  NotebookDescriptionContentItemInit,
  NotebookDescriptionContentItemDestructured,
  NotebookDescriptionContentItemSnapshot
>;
export type NotebookDescriptionContentItemType = string;
export type NotebookDescriptionContentItemFrom = number;
export type NotebookDescriptionContentItemTo = number;
export type NotebookDescriptionContentItemAttrs = ObjectEntity<
  NotebookDescriptionContentItemAttrsInit,
  NotebookDescriptionContentItemAttrsDestructured,
  NotebookDescriptionContentItemAttrsSnapshot
>;
export type NotebookDescriptionContentItemAttrsValue = any;
export type NotebookDescriptionContentItemContent = ListEntity<
  NotebookDescriptionContentItemContentInit,
  NotebookDescriptionContentItemContentDestructured,
  NotebookDescriptionContentItemContentSnapshot
>;

export type NotebookDescriptionContentItemText = string;
export type NotebookDescriptionContentItemMarks = ListEntity<
  NotebookDescriptionContentItemMarksInit,
  NotebookDescriptionContentItemMarksDestructured,
  NotebookDescriptionContentItemMarksSnapshot
>;

export type NotebookDescriptionText = string;
export type NotebookDescriptionMarks = ListEntity<
  NotebookDescriptionMarksInit,
  NotebookDescriptionMarksDestructured,
  NotebookDescriptionMarksSnapshot
>;
export type NotebookTheme = ObjectEntity<
  NotebookThemeInit,
  NotebookThemeDestructured,
  NotebookThemeSnapshot
>;
export type NotebookThemePrimaryColor =
  | "lemon"
  | "blueberry"
  | "tomato"
  | "leek"
  | "eggplant"
  | "salt";
export type NotebookThemeFontStyle = "serif" | "sans-serif";
export type NotebookThemeSpacing = "sm" | "md" | "lg";
export type NotebookThemeCorners = "rounded" | "square";
export type NotebookInit = {
  id?: string;
  createdAt?: number;
  name: string;
  coverImage?: File | null;
  icon?: File | null;
  publishedTitle?: string | null;
  description?: NotebookDescriptionInit;
  theme?: NotebookThemeInit;
};

export type NotebookDescriptionAttrsInit = {
  [key: string]: NotebookDescriptionAttrsValueInit;
};
export type NotebookDescriptionContentItemAttrsInit = {
  [key: string]: NotebookDescriptionContentItemAttrsValueInit;
};
export type NotebookDescriptionContentItemContentInit =
  | NotebookDescriptionContentInit[]
  | null;
export type NotebookDescriptionContentItemMarksInit =
  | NotebookDescriptionContentInit[]
  | null;
export type NotebookDescriptionContentItemInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: NotebookDescriptionContentItemAttrsInit;
  content?: NotebookDescriptionContentItemContentInit | null;
  text?: string | null;
  marks?: NotebookDescriptionContentItemMarksInit | null;
};
export type NotebookDescriptionContentInit =
  | NotebookDescriptionContentItemInit[]
  | null;
export type NotebookDescriptionMarksInit =
  | NotebookDescriptionContentInit[]
  | null;
export type NotebookDescriptionInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: NotebookDescriptionAttrsInit;
  content?: NotebookDescriptionContentInit | null;
  text?: string | null;
  marks?: NotebookDescriptionMarksInit | null;
};
export type NotebookThemeInit = {
  primaryColor?:
    | "lemon"
    | "blueberry"
    | "tomato"
    | "leek"
    | "eggplant"
    | "salt";
  fontStyle?: "serif" | "sans-serif";
  spacing?: "sm" | "md" | "lg";
  corners?: "rounded" | "square";
};
export type NotebookDestructured = {
  id: string;
  createdAt: number;
  name: string;
  coverImage: EntityFile | null;
  icon: EntityFile | null;
  publishedTitle: string | null;
  description: NotebookDescription;
  theme: NotebookTheme;
};

export type NotebookDescriptionAttrsDestructured = {
  [key: string]: NotebookDescriptionAttrsValue | undefined;
};
export type NotebookDescriptionContentItemAttrsDestructured = {
  [key: string]: NotebookDescriptionContentItemAttrsValue | undefined;
};
export type NotebookDescriptionContentItemContentDestructured =
  NotebookDescriptionContent[];
export type NotebookDescriptionContentItemMarksDestructured =
  NotebookDescriptionContent[];
export type NotebookDescriptionContentItemDestructured = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: NotebookDescriptionContentItemAttrs;
  content: NotebookDescriptionContentItemContent | null;
  text: string | null;
  marks: NotebookDescriptionContentItemMarks | null;
};
export type NotebookDescriptionContentDestructured =
  NotebookDescriptionContentItem[];
export type NotebookDescriptionMarksDestructured = NotebookDescriptionContent[];
export type NotebookDescriptionDestructured = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: NotebookDescriptionAttrs;
  content: NotebookDescriptionContent | null;
  text: string | null;
  marks: NotebookDescriptionMarks | null;
};
export type NotebookThemeDestructured = {
  primaryColor: "lemon" | "blueberry" | "tomato" | "leek" | "eggplant" | "salt";
  fontStyle: "serif" | "sans-serif";
  spacing: "sm" | "md" | "lg";
  corners: "rounded" | "square";
};
export type NotebookSnapshot = {
  id: string;
  createdAt: number;
  name: string;
  coverImage: EntityFileSnapshot | null;
  icon: EntityFileSnapshot | null;
  publishedTitle: string | null;
  description: NotebookDescriptionSnapshot;
  theme: NotebookThemeSnapshot;
};

export type NotebookDescriptionAttrsSnapshot = {
  [key: string]: NotebookDescriptionAttrsValueSnapshot;
};
export type NotebookDescriptionContentItemAttrsSnapshot = {
  [key: string]: NotebookDescriptionContentItemAttrsValueSnapshot;
};
export type NotebookDescriptionContentItemContentSnapshot =
  | NotebookDescriptionContentSnapshot[]
  | null;
export type NotebookDescriptionContentItemMarksSnapshot =
  | NotebookDescriptionContentSnapshot[]
  | null;
export type NotebookDescriptionContentItemSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: NotebookDescriptionContentItemAttrsSnapshot;
  content: NotebookDescriptionContentItemContentSnapshot | null;
  text: string | null;
  marks: NotebookDescriptionContentItemMarksSnapshot | null;
};
export type NotebookDescriptionContentSnapshot =
  | NotebookDescriptionContentItemSnapshot[]
  | null;
export type NotebookDescriptionMarksSnapshot =
  | NotebookDescriptionContentSnapshot[]
  | null;
export type NotebookDescriptionSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: NotebookDescriptionAttrsSnapshot;
  content: NotebookDescriptionContentSnapshot | null;
  text: string | null;
  marks: NotebookDescriptionMarksSnapshot | null;
};
export type NotebookThemeSnapshot = {
  primaryColor: "lemon" | "blueberry" | "tomato" | "leek" | "eggplant" | "salt";
  fontStyle: "serif" | "sans-serif";
  spacing: "sm" | "md" | "lg";
  corners: "rounded" | "square";
};

/** Index filters for Notebook **/

export interface NotebookNameSortFilter {
  where: "name";
  order: "asc" | "desc";
}
export interface NotebookNameMatchFilter {
  where: "name";
  equals: string;
  order?: "asc" | "desc";
}
export interface NotebookNameRangeFilter {
  where: "name";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface NotebookNameStartsWithFilter {
  where: "name";
  startsWith: string;
  order?: "asc" | "desc";
}
export type NotebookFilter =
  | NotebookNameSortFilter
  | NotebookNameMatchFilter
  | NotebookNameRangeFilter
  | NotebookNameStartsWithFilter;
