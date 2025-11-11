/** Generated types for Verdant client */
import type {
  Client as BaseClient,
  ClientInitOptions as BaseClientInitOptions,
  CollectionQueries,
  StorageSchema,
  Migration,
} from "@verdant-web/store";
export * from "@verdant-web/store";

export class Client<Presence = any, Profile = any> {
  /** Collection access for Category. Load queries, put and delete documents. */
  readonly categories: CollectionQueries<
    Category,
    CategoryInit,
    CategoryFilter
  >;

  /** Collection access for Item. Load queries, put and delete documents. */
  readonly items: CollectionQueries<Item, ItemInit, ItemFilter>;

  /** Collection access for Food. Load queries, put and delete documents. */
  readonly foods: CollectionQueries<Food, FoodInit, FoodFilter>;

  /** Collection access for List. Load queries, put and delete documents. */
  readonly lists: CollectionQueries<List, ListInit, ListFilter>;

  /** Collection access for CollaborationInfo. Load queries, put and delete documents. */
  readonly collaborationInfo: CollectionQueries<
    CollaborationInfo,
    CollaborationInfoInit,
    CollaborationInfoFilter
  >;

  /** Collection access for Recipe. Load queries, put and delete documents. */
  readonly recipes: CollectionQueries<Recipe, RecipeInit, RecipeFilter>;

  /** Collection access for RecipeTagMetadata. Load queries, put and delete documents. */
  readonly recipeTagMetadata: CollectionQueries<
    RecipeTagMetadata,
    RecipeTagMetadataInit,
    RecipeTagMetadataFilter
  >;

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
   * Get the local replica ID for this client instance.
   * Not generally useful for people besides me.
   */
  getReplicaId: BaseClient<Presence, Profile>["getReplicaId"];

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
   * would be __dangerous__resetLocal on Client, which
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

  constructor(init: ClientInitOptions<Presence, Profile>);
}

export interface ClientInitOptions<Presence = any, Profile = any>
  extends Omit<
    BaseClientInitOptions<Presence, Profile>,
    "schema" | "migrations" | "oldSchemas"
  > {
  /** WARNING: overriding the schema is dangerous and almost definitely not what you want. */
  schema?: StorageSchema;
  /** WARNING: overriding old schemas is dangerous and almost definitely not what you want. */
  oldSchemas?: StorageSchema[];
  /** WARNING: overriding the migrations is dangerous and almost definitely not what you want. */
  migrations?: Migration[];
}

import {
  ObjectEntity,
  ListEntity,
  EntityFile,
  EntityFileSnapshot,
} from "@verdant-web/store";

/** Generated types for Category */

export type Category = ObjectEntity<
  CategoryInit,
  CategoryDestructured,
  CategorySnapshot
>;
export type CategoryId = string;
export type CategoryName = string;
export type CategorySortKey = string;
export type CategoryExpirationDays = number;
export type CategoryClaim = ObjectEntity<
  CategoryClaimInit,
  CategoryClaimDestructured,
  CategoryClaimSnapshot
>;
export type CategoryClaimClaimedBy = string;
export type CategoryClaimClaimedAt = number;
export type CategoryInit = {
  id?: string;
  name: string;
  sortKey?: string;
  expirationDays?: number | null;
  claim?: CategoryClaimInit | null;
};

export type CategoryClaimInit = { claimedBy: string; claimedAt: number };
export type CategoryDestructured = {
  id: string;
  name: string;
  sortKey: string;
  expirationDays: number | null;
  claim: CategoryClaim | null;
};

export type CategoryClaimDestructured = {
  claimedBy: string;
  claimedAt: number;
};
export type CategorySnapshot = {
  id: string;
  name: string;
  sortKey: string;
  expirationDays: number | null;
  claim: CategoryClaimSnapshot | null;
};

export type CategoryClaimSnapshot = { claimedBy: string; claimedAt: number };

/** Index filters for Category **/

export interface CategorySortKeySortFilter {
  where: "sortKey";
  order: "asc" | "desc";
}
export interface CategorySortKeyMatchFilter {
  where: "sortKey";
  equals: string;
  order?: "asc" | "desc";
}
export interface CategorySortKeyRangeFilter {
  where: "sortKey";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface CategorySortKeyStartsWithFilter {
  where: "sortKey";
  startsWith: string;
  order?: "asc" | "desc";
}
export type CategoryFilter =
  | CategorySortKeySortFilter
  | CategorySortKeyMatchFilter
  | CategorySortKeyRangeFilter
  | CategorySortKeyStartsWithFilter;

/** Generated types for Item */

export type Item = ObjectEntity<ItemInit, ItemDestructured, ItemSnapshot>;
export type ItemId = string;
export type ItemCategoryId = string;
export type ItemCreatedAt = number;
export type ItemTotalQuantity = number;
export type ItemUnit = string;
export type ItemFood = string;
export type ItemInputs = ListEntity<
  ItemInputsInit,
  ItemInputsDestructured,
  ItemInputsSnapshot
>;
export type ItemInputsItem = ObjectEntity<
  ItemInputsItemInit,
  ItemInputsItemDestructured,
  ItemInputsItemSnapshot
>;
export type ItemInputsItemText = string;
export type ItemInputsItemUrl = string;
export type ItemInputsItemTitle = string;
export type ItemInputsItemMultiplier = number;
export type ItemInputsItemRecipeId = string;
export type ItemInputsItemQuantity = number;
export type ItemPurchasedAt = number;
export type ItemListId = string;
export type ItemComment = string;
export type ItemTextOverride = string;
export type ItemInit = {
  id?: string;
  categoryId?: string | null;
  createdAt?: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs?: ItemInputsInit;
  purchasedAt?: number | null;
  listId?: string | null;
  comment?: string | null;
  textOverride?: string | null;
};

export type ItemInputsItemInit = {
  text: string;
  url?: string | null;
  title?: string | null;
  multiplier?: number | null;
  recipeId?: string | null;
  quantity?: number | null;
};
export type ItemInputsInit = ItemInputsItemInit[];
export type ItemDestructured = {
  id: string;
  categoryId: string | null;
  createdAt: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs: ItemInputs;
  purchasedAt: number | null;
  listId: string | null;
  comment: string | null;
  textOverride: string | null;
};

export type ItemInputsItemDestructured = {
  text: string;
  url: string | null;
  title: string | null;
  multiplier: number | null;
  recipeId: string | null;
  quantity: number | null;
};
export type ItemInputsDestructured = ItemInputsItem[];
export type ItemSnapshot = {
  id: string;
  categoryId: string | null;
  createdAt: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs: ItemInputsSnapshot;
  purchasedAt: number | null;
  listId: string | null;
  comment: string | null;
  textOverride: string | null;
};

export type ItemInputsItemSnapshot = {
  text: string;
  url: string | null;
  title: string | null;
  multiplier: number | null;
  recipeId: string | null;
  quantity: number | null;
};
export type ItemInputsSnapshot = ItemInputsItemSnapshot[];

/** Index filters for Item **/

export interface ItemCategoryIdSortFilter {
  where: "categoryId";
  order: "asc" | "desc";
}
export interface ItemCategoryIdMatchFilter {
  where: "categoryId";
  equals: string;
  order?: "asc" | "desc";
}
export interface ItemCategoryIdRangeFilter {
  where: "categoryId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ItemCategoryIdStartsWithFilter {
  where: "categoryId";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface ItemFoodSortFilter {
  where: "food";
  order: "asc" | "desc";
}
export interface ItemFoodMatchFilter {
  where: "food";
  equals: string;
  order?: "asc" | "desc";
}
export interface ItemFoodRangeFilter {
  where: "food";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ItemFoodStartsWithFilter {
  where: "food";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface ItemPurchasedAtSortFilter {
  where: "purchasedAt";
  order: "asc" | "desc";
}
export interface ItemPurchasedAtMatchFilter {
  where: "purchasedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface ItemPurchasedAtRangeFilter {
  where: "purchasedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface ItemPurchasedSortFilter {
  where: "purchased";
  order: "asc" | "desc";
}
export interface ItemPurchasedMatchFilter {
  where: "purchased";
  equals: string;
  order?: "asc" | "desc";
}
export interface ItemPurchasedRangeFilter {
  where: "purchased";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ItemPurchasedStartsWithFilter {
  where: "purchased";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface ItemListIdSortFilter {
  where: "listId";
  order: "asc" | "desc";
}
export interface ItemListIdMatchFilter {
  where: "listId";
  equals: string;
  order?: "asc" | "desc";
}
export interface ItemListIdRangeFilter {
  where: "listId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ItemListIdStartsWithFilter {
  where: "listId";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface ItemPurchasedFoodListIdCompoundFilter {
  where: "purchased_food_listId";
  match: {
    purchased: string;
    food?: string;
    listId?: string | null;
  };
  order?: "asc" | "desc";
}
export type ItemFilter =
  | ItemCategoryIdSortFilter
  | ItemCategoryIdMatchFilter
  | ItemCategoryIdRangeFilter
  | ItemCategoryIdStartsWithFilter
  | ItemFoodSortFilter
  | ItemFoodMatchFilter
  | ItemFoodRangeFilter
  | ItemFoodStartsWithFilter
  | ItemPurchasedAtSortFilter
  | ItemPurchasedAtMatchFilter
  | ItemPurchasedAtRangeFilter
  | ItemPurchasedSortFilter
  | ItemPurchasedMatchFilter
  | ItemPurchasedRangeFilter
  | ItemPurchasedStartsWithFilter
  | ItemListIdSortFilter
  | ItemListIdMatchFilter
  | ItemListIdRangeFilter
  | ItemListIdStartsWithFilter
  | ItemPurchasedFoodListIdCompoundFilter;

/** Generated types for Food */

export type Food = ObjectEntity<FoodInit, FoodDestructured, FoodSnapshot>;
export type FoodCanonicalName = string;
export type FoodAlternateNames = ListEntity<
  FoodAlternateNamesInit,
  FoodAlternateNamesDestructured,
  FoodAlternateNamesSnapshot
>;
export type FoodAlternateNamesItem = string;
export type FoodCategoryId = string;
export type FoodExpiresAfterDays = number;
export type FoodLastPurchasedAt = number;
export type FoodInInventory = boolean;
export type FoodExpiresAt = number;
export type FoodFrozenAt = number;
export type FoodPurchaseIntervalGuess = number;
export type FoodLastAddedAt = number;
export type FoodPurchaseCount = number;
export type FoodDefaultListId = string;
export type FoodPluralizeName = boolean;
export type FoodDoNotSuggest = boolean;
/** When a staple item is depleted, it is automatically added to the list */
export type FoodIsStaple = boolean;
export type FoodInit = {
  canonicalName: string;
  alternateNames?: FoodAlternateNamesInit;
  categoryId?: string | null;
  expiresAfterDays?: number | null;
  lastPurchasedAt?: number | null;
  inInventory?: boolean;
  expiresAt?: number | null;
  frozenAt?: number | null;
  purchaseIntervalGuess?: number | null;
  lastAddedAt?: number | null;
  purchaseCount?: number;
  defaultListId?: string | null;
  pluralizeName?: boolean;
  doNotSuggest?: boolean;
  isStaple?: boolean;
};

export type FoodAlternateNamesInit = string[];
export type FoodDestructured = {
  canonicalName: string;
  alternateNames: FoodAlternateNames;
  categoryId: string | null;
  expiresAfterDays: number | null;
  lastPurchasedAt: number | null;
  inInventory: boolean;
  expiresAt: number | null;
  frozenAt: number | null;
  purchaseIntervalGuess: number | null;
  lastAddedAt: number | null;
  purchaseCount: number;
  defaultListId: string | null;
  pluralizeName: boolean;
  doNotSuggest: boolean;
  isStaple: boolean;
};

export type FoodAlternateNamesDestructured = string[];
export type FoodSnapshot = {
  canonicalName: string;
  alternateNames: FoodAlternateNamesSnapshot;
  categoryId: string | null;
  expiresAfterDays: number | null;
  lastPurchasedAt: number | null;
  inInventory: boolean;
  expiresAt: number | null;
  frozenAt: number | null;
  purchaseIntervalGuess: number | null;
  lastAddedAt: number | null;
  purchaseCount: number;
  defaultListId: string | null;
  pluralizeName: boolean;
  doNotSuggest: boolean;
  isStaple: boolean;
};

export type FoodAlternateNamesSnapshot = string[];

/** Index filters for Food **/

export interface FoodCategoryIdSortFilter {
  where: "categoryId";
  order: "asc" | "desc";
}
export interface FoodCategoryIdMatchFilter {
  where: "categoryId";
  equals: string;
  order?: "asc" | "desc";
}
export interface FoodCategoryIdRangeFilter {
  where: "categoryId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface FoodCategoryIdStartsWithFilter {
  where: "categoryId";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface FoodNameLookupSortFilter {
  where: "nameLookup";
  order: "asc" | "desc";
}
export interface FoodNameLookupMatchFilter {
  where: "nameLookup";
  equals: string;
  order?: "asc" | "desc";
}
export interface FoodNameLookupRangeFilter {
  where: "nameLookup";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface FoodNameLookupStartsWithFilter {
  where: "nameLookup";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface FoodAnyNameSortFilter {
  where: "anyName";
  order: "asc" | "desc";
}
export interface FoodAnyNameMatchFilter {
  where: "anyName";
  equals: string;
  order?: "asc" | "desc";
}
export interface FoodAnyNameRangeFilter {
  where: "anyName";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface FoodAnyNameStartsWithFilter {
  where: "anyName";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface FoodRepurchaseAfterSortFilter {
  where: "repurchaseAfter";
  order: "asc" | "desc";
}
export interface FoodRepurchaseAfterMatchFilter {
  where: "repurchaseAfter";
  equals: number;
  order?: "asc" | "desc";
}
export interface FoodRepurchaseAfterRangeFilter {
  where: "repurchaseAfter";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface FoodPurchasedAndExpiresAtSortFilter {
  where: "purchasedAndExpiresAt";
  order: "asc" | "desc";
}
export interface FoodPurchasedAndExpiresAtMatchFilter {
  where: "purchasedAndExpiresAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface FoodPurchasedAndExpiresAtRangeFilter {
  where: "purchasedAndExpiresAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface FoodLastPurchasedAtOrZeroSortFilter {
  where: "lastPurchasedAtOrZero";
  order: "asc" | "desc";
}
export interface FoodLastPurchasedAtOrZeroMatchFilter {
  where: "lastPurchasedAtOrZero";
  equals: number;
  order?: "asc" | "desc";
}
export interface FoodLastPurchasedAtOrZeroRangeFilter {
  where: "lastPurchasedAtOrZero";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface FoodFrozenSortFilter {
  where: "frozen";
  order: "asc" | "desc";
}
export interface FoodFrozenMatchFilter {
  where: "frozen";
  equals: boolean;
  order?: "asc" | "desc";
}
export interface FoodFrozenRangeFilter {
  where: "frozen";
  gte?: boolean;
  gt?: boolean;
  lte?: boolean;
  lt?: boolean;
  order?: "asc" | "desc";
}
export interface FoodPurchaseCountSortFilter {
  where: "purchaseCount";
  order: "asc" | "desc";
}
export interface FoodPurchaseCountMatchFilter {
  where: "purchaseCount";
  equals: number;
  order?: "asc" | "desc";
}
export interface FoodPurchaseCountRangeFilter {
  where: "purchaseCount";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface FoodIsStapleSortFilter {
  where: "isStaple";
  order: "asc" | "desc";
}
export interface FoodIsStapleMatchFilter {
  where: "isStaple";
  equals: boolean;
  order?: "asc" | "desc";
}
export interface FoodIsStapleRangeFilter {
  where: "isStaple";
  gte?: boolean;
  gt?: boolean;
  lte?: boolean;
  lt?: boolean;
  order?: "asc" | "desc";
}
export interface FoodCategoryIdLastPurchasedAtCompoundFilter {
  where: "categoryId_lastPurchasedAt";
  match: {
    categoryId: string | null;
    lastPurchasedAtOrZero?: number;
  };
  order?: "asc" | "desc";
}
export interface FoodInInventoryCategoryIdLastPurchasedAtCompoundFilter {
  where: "inInventory_categoryId_lastPurchasedAt";
  match: {
    inInventory: boolean;
    categoryId?: string | null;
    lastPurchasedAtOrZero?: number;
  };
  order?: "asc" | "desc";
}
export type FoodFilter =
  | FoodCategoryIdSortFilter
  | FoodCategoryIdMatchFilter
  | FoodCategoryIdRangeFilter
  | FoodCategoryIdStartsWithFilter
  | FoodNameLookupSortFilter
  | FoodNameLookupMatchFilter
  | FoodNameLookupRangeFilter
  | FoodNameLookupStartsWithFilter
  | FoodAnyNameSortFilter
  | FoodAnyNameMatchFilter
  | FoodAnyNameRangeFilter
  | FoodAnyNameStartsWithFilter
  | FoodRepurchaseAfterSortFilter
  | FoodRepurchaseAfterMatchFilter
  | FoodRepurchaseAfterRangeFilter
  | FoodPurchasedAndExpiresAtSortFilter
  | FoodPurchasedAndExpiresAtMatchFilter
  | FoodPurchasedAndExpiresAtRangeFilter
  | FoodLastPurchasedAtOrZeroSortFilter
  | FoodLastPurchasedAtOrZeroMatchFilter
  | FoodLastPurchasedAtOrZeroRangeFilter
  | FoodFrozenSortFilter
  | FoodFrozenMatchFilter
  | FoodFrozenRangeFilter
  | FoodPurchaseCountSortFilter
  | FoodPurchaseCountMatchFilter
  | FoodPurchaseCountRangeFilter
  | FoodIsStapleSortFilter
  | FoodIsStapleMatchFilter
  | FoodIsStapleRangeFilter
  | FoodCategoryIdLastPurchasedAtCompoundFilter
  | FoodInInventoryCategoryIdLastPurchasedAtCompoundFilter;

/** Generated types for List */

export type List = ObjectEntity<ListInit, ListDestructured, ListSnapshot>;
export type ListId = string;
export type ListName = string;
export type ListColor = string;
export type ListInit = { id?: string; name: string; color: string };

export type ListDestructured = { id: string; name: string; color: string };

export type ListSnapshot = { id: string; name: string; color: string };

/** Index filters for List **/

export type ListFilter = never;

/** Generated types for CollaborationInfo */

export type CollaborationInfo = ObjectEntity<
  CollaborationInfoInit,
  CollaborationInfoDestructured,
  CollaborationInfoSnapshot
>;
export type CollaborationInfoId = string;
export type CollaborationInfoMeetup = ObjectEntity<
  CollaborationInfoMeetupInit,
  CollaborationInfoMeetupDestructured,
  CollaborationInfoMeetupSnapshot
>;
export type CollaborationInfoMeetupCreatedAt = number;
export type CollaborationInfoMeetupLocation = string;
export type CollaborationInfoInit = {
  id?: string;
  meetup?: CollaborationInfoMeetupInit | null;
};

export type CollaborationInfoMeetupInit = {
  createdAt?: number;
  location: string;
};
export type CollaborationInfoDestructured = {
  id: string;
  meetup: CollaborationInfoMeetup | null;
};

export type CollaborationInfoMeetupDestructured = {
  createdAt: number;
  location: string;
};
export type CollaborationInfoSnapshot = {
  id: string;
  meetup: CollaborationInfoMeetupSnapshot | null;
};

export type CollaborationInfoMeetupSnapshot = {
  createdAt: number;
  location: string;
};

/** Index filters for CollaborationInfo **/

export type CollaborationInfoFilter = never;

/** Generated types for Recipe */

export type Recipe = ObjectEntity<
  RecipeInit,
  RecipeDestructured,
  RecipeSnapshot
>;
export type RecipeId = string;
export type RecipeSlug = string;
export type RecipeMultiplier = number;
export type RecipeTitle = string;
export type RecipeCreatedAt = number;
export type RecipeUpdatedAt = number;
export type RecipePrepTimeMinutes = number;
export type RecipeCookTimeMinutes = number;
export type RecipeTotalTimeMinutes = number;
export type RecipeServings = number;
export type RecipePrelude = ObjectEntity<
  RecipePreludeInit,
  RecipePreludeDestructured,
  RecipePreludeSnapshot
>;
export type RecipePreludeType = string;
export type RecipePreludeFrom = number;
export type RecipePreludeTo = number;
export type RecipePreludeAttrs = ObjectEntity<
  RecipePreludeAttrsInit,
  RecipePreludeAttrsDestructured,
  RecipePreludeAttrsSnapshot
>;
export type RecipePreludeAttrsValue = any;
export type RecipePreludeContent = ListEntity<
  RecipePreludeContentInit,
  RecipePreludeContentDestructured,
  RecipePreludeContentSnapshot
>;
export type RecipePreludeContentItem = ObjectEntity<
  RecipePreludeContentItemInit,
  RecipePreludeContentItemDestructured,
  RecipePreludeContentItemSnapshot
>;
export type RecipePreludeContentItemType = string;
export type RecipePreludeContentItemFrom = number;
export type RecipePreludeContentItemTo = number;
export type RecipePreludeContentItemAttrs = ObjectEntity<
  RecipePreludeContentItemAttrsInit,
  RecipePreludeContentItemAttrsDestructured,
  RecipePreludeContentItemAttrsSnapshot
>;
export type RecipePreludeContentItemAttrsValue = any;
export type RecipePreludeContentItemContent = ListEntity<
  RecipePreludeContentItemContentInit,
  RecipePreludeContentItemContentDestructured,
  RecipePreludeContentItemContentSnapshot
>;

export type RecipePreludeContentItemText = string;
export type RecipePreludeContentItemMarks = ListEntity<
  RecipePreludeContentItemMarksInit,
  RecipePreludeContentItemMarksDestructured,
  RecipePreludeContentItemMarksSnapshot
>;

export type RecipePreludeText = string;
export type RecipePreludeMarks = ListEntity<
  RecipePreludeMarksInit,
  RecipePreludeMarksDestructured,
  RecipePreludeMarksSnapshot
>;
export type RecipeNote = string;
export type RecipeIngredients = ListEntity<
  RecipeIngredientsInit,
  RecipeIngredientsDestructured,
  RecipeIngredientsSnapshot
>;
export type RecipeIngredientsItem = ObjectEntity<
  RecipeIngredientsItemInit,
  RecipeIngredientsItemDestructured,
  RecipeIngredientsItemSnapshot
>;
export type RecipeIngredientsItemId = string;
export type RecipeIngredientsItemText = string;
export type RecipeIngredientsItemUnit = string;
export type RecipeIngredientsItemFood = string;
export type RecipeIngredientsItemQuantity = number;
export type RecipeIngredientsItemComments = ListEntity<
  RecipeIngredientsItemCommentsInit,
  RecipeIngredientsItemCommentsDestructured,
  RecipeIngredientsItemCommentsSnapshot
>;
export type RecipeIngredientsItemCommentsItem = string;
export type RecipeIngredientsItemNote = string;
export type RecipeIngredientsItemIsSectionHeader = boolean;
export type RecipeInstructions = ObjectEntity<
  RecipeInstructionsInit,
  RecipeInstructionsDestructured,
  RecipeInstructionsSnapshot
>;
export type RecipeInstructionsType = string;
export type RecipeInstructionsFrom = number;
export type RecipeInstructionsTo = number;
export type RecipeInstructionsAttrs = ObjectEntity<
  RecipeInstructionsAttrsInit,
  RecipeInstructionsAttrsDestructured,
  RecipeInstructionsAttrsSnapshot
>;
export type RecipeInstructionsAttrsValue = any;
export type RecipeInstructionsContent = ListEntity<
  RecipeInstructionsContentInit,
  RecipeInstructionsContentDestructured,
  RecipeInstructionsContentSnapshot
>;
export type RecipeInstructionsContentItem = ObjectEntity<
  RecipeInstructionsContentItemInit,
  RecipeInstructionsContentItemDestructured,
  RecipeInstructionsContentItemSnapshot
>;
export type RecipeInstructionsContentItemType = string;
export type RecipeInstructionsContentItemFrom = number;
export type RecipeInstructionsContentItemTo = number;
export type RecipeInstructionsContentItemAttrs = ObjectEntity<
  RecipeInstructionsContentItemAttrsInit,
  RecipeInstructionsContentItemAttrsDestructured,
  RecipeInstructionsContentItemAttrsSnapshot
>;
export type RecipeInstructionsContentItemAttrsValue = any;
export type RecipeInstructionsContentItemContent = ListEntity<
  RecipeInstructionsContentItemContentInit,
  RecipeInstructionsContentItemContentDestructured,
  RecipeInstructionsContentItemContentSnapshot
>;

export type RecipeInstructionsContentItemText = string;
export type RecipeInstructionsContentItemMarks = ListEntity<
  RecipeInstructionsContentItemMarksInit,
  RecipeInstructionsContentItemMarksDestructured,
  RecipeInstructionsContentItemMarksSnapshot
>;

export type RecipeInstructionsText = string;
export type RecipeInstructionsMarks = ListEntity<
  RecipeInstructionsMarksInit,
  RecipeInstructionsMarksDestructured,
  RecipeInstructionsMarksSnapshot
>;
export type RecipeUrl = string;
export type RecipeSession = ObjectEntity<
  RecipeSessionInit,
  RecipeSessionDestructured,
  RecipeSessionSnapshot
>;
export type RecipeSessionStartedAt = number;
export type RecipeSessionCompletedInstructions = ListEntity<
  RecipeSessionCompletedInstructionsInit,
  RecipeSessionCompletedInstructionsDestructured,
  RecipeSessionCompletedInstructionsSnapshot
>;
export type RecipeSessionCompletedInstructionsItem = string;
export type RecipeSessionCompletedIngredients = ListEntity<
  RecipeSessionCompletedIngredientsInit,
  RecipeSessionCompletedIngredientsDestructured,
  RecipeSessionCompletedIngredientsSnapshot
>;
export type RecipeSessionCompletedIngredientsItem = string;
export type RecipeSessionInstructionAssignments = ObjectEntity<
  RecipeSessionInstructionAssignmentsInit,
  RecipeSessionInstructionAssignmentsDestructured,
  RecipeSessionInstructionAssignmentsSnapshot
>;
export type RecipeSessionInstructionAssignmentsValue = string;
export type RecipeSessionIngredientAssignments = ObjectEntity<
  RecipeSessionIngredientAssignmentsInit,
  RecipeSessionIngredientAssignmentsDestructured,
  RecipeSessionIngredientAssignmentsSnapshot
>;
export type RecipeSessionIngredientAssignmentsValue = string;
export type RecipeTags = ListEntity<
  RecipeTagsInit,
  RecipeTagsDestructured,
  RecipeTagsSnapshot
>;
export type RecipeTagsItem = string;
export type RecipeMainImage = EntityFile;
export type RecipeCookCount = number;
export type RecipeLastCookedAt = number;
export type RecipeLastAddedAt = number;
export type RecipeAddIntervalGuess = number;
export type RecipePinnedAt = number;
export type RecipeSubRecipeMultipliers = ObjectEntity<
  RecipeSubRecipeMultipliersInit,
  RecipeSubRecipeMultipliersDestructured,
  RecipeSubRecipeMultipliersSnapshot
>;
export type RecipeSubRecipeMultipliersValue = number;
export type RecipeInit = {
  id?: string;
  slug?: string;
  multiplier?: number;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  totalTimeMinutes?: number | null;
  servings?: number | null;
  prelude?: RecipePreludeInit;
  note?: string | null;
  ingredients?: RecipeIngredientsInit;
  instructions?: RecipeInstructionsInit;
  url?: string | null;
  session?: RecipeSessionInit | null;
  tags?: RecipeTagsInit;
  mainImage?: File | null;
  cookCount?: number;
  lastCookedAt?: number | null;
  lastAddedAt?: number | null;
  addIntervalGuess?: number | null;
  pinnedAt?: number | null;
  subRecipeMultipliers?: RecipeSubRecipeMultipliersInit;
};

export type RecipePreludeAttrsInit = {
  [key: string]: RecipePreludeAttrsValueInit;
};
export type RecipePreludeContentItemAttrsInit = {
  [key: string]: RecipePreludeContentItemAttrsValueInit;
};
export type RecipePreludeContentItemContentInit =
  | RecipePreludeContentInit[]
  | null;
export type RecipePreludeContentItemMarksInit =
  | RecipePreludeContentInit[]
  | null;
export type RecipePreludeContentItemInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: RecipePreludeContentItemAttrsInit;
  content?: RecipePreludeContentItemContentInit | null;
  text?: string | null;
  marks?: RecipePreludeContentItemMarksInit | null;
};
export type RecipePreludeContentInit = RecipePreludeContentItemInit[] | null;
export type RecipePreludeMarksInit = RecipePreludeContentInit[] | null;
export type RecipePreludeInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: RecipePreludeAttrsInit;
  content?: RecipePreludeContentInit | null;
  text?: string | null;
  marks?: RecipePreludeMarksInit | null;
};
export type RecipeIngredientsItemCommentsInit = string[];
export type RecipeIngredientsItemInit = {
  id?: string;
  text: string;
  unit?: string | null;
  food?: string | null;
  quantity?: number;
  comments?: RecipeIngredientsItemCommentsInit;
  note?: string | null;
  isSectionHeader?: boolean;
};
export type RecipeIngredientsInit = RecipeIngredientsItemInit[];
export type RecipeInstructionsAttrsInit = {
  [key: string]: RecipeInstructionsAttrsValueInit;
};
export type RecipeInstructionsContentItemAttrsInit = {
  [key: string]: RecipeInstructionsContentItemAttrsValueInit;
};
export type RecipeInstructionsContentItemContentInit =
  | RecipeInstructionsContentInit[]
  | null;
export type RecipeInstructionsContentItemMarksInit =
  | RecipeInstructionsContentInit[]
  | null;
export type RecipeInstructionsContentItemInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: RecipeInstructionsContentItemAttrsInit;
  content?: RecipeInstructionsContentItemContentInit | null;
  text?: string | null;
  marks?: RecipeInstructionsContentItemMarksInit | null;
};
export type RecipeInstructionsContentInit =
  | RecipeInstructionsContentItemInit[]
  | null;
export type RecipeInstructionsMarksInit =
  | RecipeInstructionsContentInit[]
  | null;
export type RecipeInstructionsInit = {
  type: string;
  from?: number | null;
  to?: number | null;
  attrs?: RecipeInstructionsAttrsInit;
  content?: RecipeInstructionsContentInit | null;
  text?: string | null;
  marks?: RecipeInstructionsMarksInit | null;
};
export type RecipeSessionCompletedInstructionsInit = string[];
export type RecipeSessionCompletedIngredientsInit = string[];
export type RecipeSessionInstructionAssignmentsInit = {
  [key: string]: RecipeSessionInstructionAssignmentsValueInit;
};
export type RecipeSessionIngredientAssignmentsInit = {
  [key: string]: RecipeSessionIngredientAssignmentsValueInit;
};
export type RecipeSessionInit = {
  startedAt?: number;
  completedInstructions?: RecipeSessionCompletedInstructionsInit;
  completedIngredients?: RecipeSessionCompletedIngredientsInit;
  instructionAssignments?: RecipeSessionInstructionAssignmentsInit;
  ingredientAssignments?: RecipeSessionIngredientAssignmentsInit;
};
export type RecipeTagsInit = string[];
export type RecipeSubRecipeMultipliersInit = {
  [key: string]: RecipeSubRecipeMultipliersValueInit;
};
export type RecipeDestructured = {
  id: string;
  slug: string;
  multiplier: number;
  title: string;
  createdAt: number;
  updatedAt: number;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  totalTimeMinutes: number | null;
  servings: number | null;
  prelude: RecipePrelude;
  note: string | null;
  ingredients: RecipeIngredients;
  instructions: RecipeInstructions;
  url: string | null;
  session: RecipeSession | null;
  tags: RecipeTags;
  mainImage: EntityFile | null;
  cookCount: number;
  lastCookedAt: number | null;
  lastAddedAt: number | null;
  addIntervalGuess: number | null;
  pinnedAt: number | null;
  subRecipeMultipliers: RecipeSubRecipeMultipliers;
};

export type RecipePreludeAttrsDestructured = {
  [key: string]: RecipePreludeAttrsValue | undefined;
};
export type RecipePreludeContentItemAttrsDestructured = {
  [key: string]: RecipePreludeContentItemAttrsValue | undefined;
};
export type RecipePreludeContentItemContentDestructured =
  RecipePreludeContent[];
export type RecipePreludeContentItemMarksDestructured = RecipePreludeContent[];
export type RecipePreludeContentItemDestructured = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: RecipePreludeContentItemAttrs;
  content: RecipePreludeContentItemContent | null;
  text: string | null;
  marks: RecipePreludeContentItemMarks | null;
};
export type RecipePreludeContentDestructured = RecipePreludeContentItem[];
export type RecipePreludeMarksDestructured = RecipePreludeContent[];
export type RecipePreludeDestructured = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: RecipePreludeAttrs;
  content: RecipePreludeContent | null;
  text: string | null;
  marks: RecipePreludeMarks | null;
};
export type RecipeIngredientsItemCommentsDestructured = string[];
export type RecipeIngredientsItemDestructured = {
  id: string;
  text: string;
  unit: string | null;
  food: string | null;
  quantity: number;
  comments: RecipeIngredientsItemComments;
  note: string | null;
  isSectionHeader: boolean;
};
export type RecipeIngredientsDestructured = RecipeIngredientsItem[];
export type RecipeInstructionsAttrsDestructured = {
  [key: string]: RecipeInstructionsAttrsValue | undefined;
};
export type RecipeInstructionsContentItemAttrsDestructured = {
  [key: string]: RecipeInstructionsContentItemAttrsValue | undefined;
};
export type RecipeInstructionsContentItemContentDestructured =
  RecipeInstructionsContent[];
export type RecipeInstructionsContentItemMarksDestructured =
  RecipeInstructionsContent[];
export type RecipeInstructionsContentItemDestructured = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: RecipeInstructionsContentItemAttrs;
  content: RecipeInstructionsContentItemContent | null;
  text: string | null;
  marks: RecipeInstructionsContentItemMarks | null;
};
export type RecipeInstructionsContentDestructured =
  RecipeInstructionsContentItem[];
export type RecipeInstructionsMarksDestructured = RecipeInstructionsContent[];
export type RecipeInstructionsDestructured = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: RecipeInstructionsAttrs;
  content: RecipeInstructionsContent | null;
  text: string | null;
  marks: RecipeInstructionsMarks | null;
};
export type RecipeSessionCompletedInstructionsDestructured = string[];
export type RecipeSessionCompletedIngredientsDestructured = string[];
export type RecipeSessionInstructionAssignmentsDestructured = {
  [key: string]: RecipeSessionInstructionAssignmentsValue | undefined;
};
export type RecipeSessionIngredientAssignmentsDestructured = {
  [key: string]: RecipeSessionIngredientAssignmentsValue | undefined;
};
export type RecipeSessionDestructured = {
  startedAt: number;
  completedInstructions: RecipeSessionCompletedInstructions;
  completedIngredients: RecipeSessionCompletedIngredients;
  instructionAssignments: RecipeSessionInstructionAssignments;
  ingredientAssignments: RecipeSessionIngredientAssignments;
};
export type RecipeTagsDestructured = string[];
export type RecipeSubRecipeMultipliersDestructured = {
  [key: string]: RecipeSubRecipeMultipliersValue | undefined;
};
export type RecipeSnapshot = {
  id: string;
  slug: string;
  multiplier: number;
  title: string;
  createdAt: number;
  updatedAt: number;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  totalTimeMinutes: number | null;
  servings: number | null;
  prelude: RecipePreludeSnapshot;
  note: string | null;
  ingredients: RecipeIngredientsSnapshot;
  instructions: RecipeInstructionsSnapshot;
  url: string | null;
  session: RecipeSessionSnapshot | null;
  tags: RecipeTagsSnapshot;
  mainImage: EntityFileSnapshot | null;
  cookCount: number;
  lastCookedAt: number | null;
  lastAddedAt: number | null;
  addIntervalGuess: number | null;
  pinnedAt: number | null;
  subRecipeMultipliers: RecipeSubRecipeMultipliersSnapshot;
};

export type RecipePreludeAttrsSnapshot = {
  [key: string]: RecipePreludeAttrsValueSnapshot;
};
export type RecipePreludeContentItemAttrsSnapshot = {
  [key: string]: RecipePreludeContentItemAttrsValueSnapshot;
};
export type RecipePreludeContentItemContentSnapshot =
  | RecipePreludeContentSnapshot[]
  | null;
export type RecipePreludeContentItemMarksSnapshot =
  | RecipePreludeContentSnapshot[]
  | null;
export type RecipePreludeContentItemSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: RecipePreludeContentItemAttrsSnapshot;
  content: RecipePreludeContentItemContentSnapshot | null;
  text: string | null;
  marks: RecipePreludeContentItemMarksSnapshot | null;
};
export type RecipePreludeContentSnapshot =
  | RecipePreludeContentItemSnapshot[]
  | null;
export type RecipePreludeMarksSnapshot = RecipePreludeContentSnapshot[] | null;
export type RecipePreludeSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: RecipePreludeAttrsSnapshot;
  content: RecipePreludeContentSnapshot | null;
  text: string | null;
  marks: RecipePreludeMarksSnapshot | null;
};
export type RecipeIngredientsItemCommentsSnapshot = string[];
export type RecipeIngredientsItemSnapshot = {
  id: string;
  text: string;
  unit: string | null;
  food: string | null;
  quantity: number;
  comments: RecipeIngredientsItemCommentsSnapshot;
  note: string | null;
  isSectionHeader: boolean;
};
export type RecipeIngredientsSnapshot = RecipeIngredientsItemSnapshot[];
export type RecipeInstructionsAttrsSnapshot = {
  [key: string]: RecipeInstructionsAttrsValueSnapshot;
};
export type RecipeInstructionsContentItemAttrsSnapshot = {
  [key: string]: RecipeInstructionsContentItemAttrsValueSnapshot;
};
export type RecipeInstructionsContentItemContentSnapshot =
  | RecipeInstructionsContentSnapshot[]
  | null;
export type RecipeInstructionsContentItemMarksSnapshot =
  | RecipeInstructionsContentSnapshot[]
  | null;
export type RecipeInstructionsContentItemSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: RecipeInstructionsContentItemAttrsSnapshot;
  content: RecipeInstructionsContentItemContentSnapshot | null;
  text: string | null;
  marks: RecipeInstructionsContentItemMarksSnapshot | null;
};
export type RecipeInstructionsContentSnapshot =
  | RecipeInstructionsContentItemSnapshot[]
  | null;
export type RecipeInstructionsMarksSnapshot =
  | RecipeInstructionsContentSnapshot[]
  | null;
export type RecipeInstructionsSnapshot = {
  type: string;
  from: number | null;
  to: number | null;
  attrs: RecipeInstructionsAttrsSnapshot;
  content: RecipeInstructionsContentSnapshot | null;
  text: string | null;
  marks: RecipeInstructionsMarksSnapshot | null;
};
export type RecipeSessionCompletedInstructionsSnapshot = string[];
export type RecipeSessionCompletedIngredientsSnapshot = string[];
export type RecipeSessionInstructionAssignmentsSnapshot = {
  [key: string]: RecipeSessionInstructionAssignmentsValueSnapshot;
};
export type RecipeSessionIngredientAssignmentsSnapshot = {
  [key: string]: RecipeSessionIngredientAssignmentsValueSnapshot;
};
export type RecipeSessionSnapshot = {
  startedAt: number;
  completedInstructions: RecipeSessionCompletedInstructionsSnapshot;
  completedIngredients: RecipeSessionCompletedIngredientsSnapshot;
  instructionAssignments: RecipeSessionInstructionAssignmentsSnapshot;
  ingredientAssignments: RecipeSessionIngredientAssignmentsSnapshot;
};
export type RecipeTagsSnapshot = string[];
export type RecipeSubRecipeMultipliersSnapshot = {
  [key: string]: RecipeSubRecipeMultipliersValueSnapshot;
};

/** Index filters for Recipe **/

export interface RecipeSlugSortFilter {
  where: "slug";
  order: "asc" | "desc";
}
export interface RecipeSlugMatchFilter {
  where: "slug";
  equals: string;
  order?: "asc" | "desc";
}
export interface RecipeSlugRangeFilter {
  where: "slug";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface RecipeSlugStartsWithFilter {
  where: "slug";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface RecipeUpdatedAtSortFilter {
  where: "updatedAt";
  order: "asc" | "desc";
}
export interface RecipeUpdatedAtMatchFilter {
  where: "updatedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface RecipeUpdatedAtRangeFilter {
  where: "updatedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface RecipePinnedAtSortFilter {
  where: "pinnedAt";
  order: "asc" | "desc";
}
export interface RecipePinnedAtMatchFilter {
  where: "pinnedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface RecipePinnedAtRangeFilter {
  where: "pinnedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface RecipeTagSortFilter {
  where: "tag";
  order: "asc" | "desc";
}
export interface RecipeTagMatchFilter {
  where: "tag";
  equals: string;
  order?: "asc" | "desc";
}
export interface RecipeTagRangeFilter {
  where: "tag";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface RecipeTagStartsWithFilter {
  where: "tag";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface RecipeSuggestAfterSortFilter {
  where: "suggestAfter";
  order: "asc" | "desc";
}
export interface RecipeSuggestAfterMatchFilter {
  where: "suggestAfter";
  equals: number;
  order?: "asc" | "desc";
}
export interface RecipeSuggestAfterRangeFilter {
  where: "suggestAfter";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface RecipeFoodSortFilter {
  where: "food";
  order: "asc" | "desc";
}
export interface RecipeFoodMatchFilter {
  where: "food";
  equals: string;
  order?: "asc" | "desc";
}
export interface RecipeFoodRangeFilter {
  where: "food";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface RecipeFoodStartsWithFilter {
  where: "food";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface RecipeTitleMatchSortFilter {
  where: "titleMatch";
  order: "asc" | "desc";
}
export interface RecipeTitleMatchMatchFilter {
  where: "titleMatch";
  equals: string;
  order?: "asc" | "desc";
}
export interface RecipeTitleMatchRangeFilter {
  where: "titleMatch";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface RecipeTitleMatchStartsWithFilter {
  where: "titleMatch";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface RecipeGeneralSearchSortFilter {
  where: "generalSearch";
  order: "asc" | "desc";
}
export interface RecipeGeneralSearchMatchFilter {
  where: "generalSearch";
  equals: string;
  order?: "asc" | "desc";
}
export interface RecipeGeneralSearchRangeFilter {
  where: "generalSearch";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface RecipeGeneralSearchStartsWithFilter {
  where: "generalSearch";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface RecipeSessionStartedAtSortFilter {
  where: "sessionStartedAt";
  order: "asc" | "desc";
}
export interface RecipeSessionStartedAtMatchFilter {
  where: "sessionStartedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface RecipeSessionStartedAtRangeFilter {
  where: "sessionStartedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type RecipeFilter =
  | RecipeSlugSortFilter
  | RecipeSlugMatchFilter
  | RecipeSlugRangeFilter
  | RecipeSlugStartsWithFilter
  | RecipeUpdatedAtSortFilter
  | RecipeUpdatedAtMatchFilter
  | RecipeUpdatedAtRangeFilter
  | RecipePinnedAtSortFilter
  | RecipePinnedAtMatchFilter
  | RecipePinnedAtRangeFilter
  | RecipeTagSortFilter
  | RecipeTagMatchFilter
  | RecipeTagRangeFilter
  | RecipeTagStartsWithFilter
  | RecipeSuggestAfterSortFilter
  | RecipeSuggestAfterMatchFilter
  | RecipeSuggestAfterRangeFilter
  | RecipeFoodSortFilter
  | RecipeFoodMatchFilter
  | RecipeFoodRangeFilter
  | RecipeFoodStartsWithFilter
  | RecipeTitleMatchSortFilter
  | RecipeTitleMatchMatchFilter
  | RecipeTitleMatchRangeFilter
  | RecipeTitleMatchStartsWithFilter
  | RecipeGeneralSearchSortFilter
  | RecipeGeneralSearchMatchFilter
  | RecipeGeneralSearchRangeFilter
  | RecipeGeneralSearchStartsWithFilter
  | RecipeSessionStartedAtSortFilter
  | RecipeSessionStartedAtMatchFilter
  | RecipeSessionStartedAtRangeFilter;

/** Generated types for RecipeTagMetadata */

export type RecipeTagMetadata = ObjectEntity<
  RecipeTagMetadataInit,
  RecipeTagMetadataDestructured,
  RecipeTagMetadataSnapshot
>;
export type RecipeTagMetadataName = string;
export type RecipeTagMetadataColor = string;
export type RecipeTagMetadataIcon = string;
export type RecipeTagMetadataInit = {
  name: string;
  color?: string | null;
  icon?: string | null;
};

export type RecipeTagMetadataDestructured = {
  name: string;
  color: string | null;
  icon: string | null;
};

export type RecipeTagMetadataSnapshot = {
  name: string;
  color: string | null;
  icon: string | null;
};

/** Index filters for RecipeTagMetadata **/

export type RecipeTagMetadataFilter = never;
