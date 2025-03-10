import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type CategorySnapshot = {
  id: string;
  name: string;
  sortKey: string;
  expirationDays: number | null;
  claim: CategoryClaimSnapshot | null;
};

export type CategoryClaimSnapshot = { claimedBy: string; claimedAt: number };
export type CategoryInit = {
  id?: string;
  name: string;
  sortKey?: string;
  expirationDays?: number | null;
  claim?: CategoryClaimInit | null;
};

export type CategoryClaimInit = { claimedBy: string; claimedAt: number };

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

export type ListSnapshot = { id: string; name: string; color: string };
export type ListInit = { id?: string; name: string; color: string };

export type CollaborationInfoSnapshot = {
  id: string;
  meetup: CollaborationInfoMeetupSnapshot | null;
};

export type CollaborationInfoMeetupSnapshot = {
  createdAt: number;
  location: string;
};
export type CollaborationInfoInit = {
  id?: string;
  meetup?: CollaborationInfoMeetupInit | null;
};

export type CollaborationInfoMeetupInit = {
  createdAt?: number;
  location: string;
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

export type RecipeTagMetadataSnapshot = {
  name: string;
  color: string | null;
  icon: string | null;
};
export type RecipeTagMetadataInit = {
  name: string;
  color?: string | null;
  icon?: string | null;
};

export type MigrationTypes = {
  categories: { init: CategoryInit; snapshot: CategorySnapshot };
  items: { init: ItemInit; snapshot: ItemSnapshot };
  foods: { init: FoodInit; snapshot: FoodSnapshot };
  lists: { init: ListInit; snapshot: ListSnapshot };
  collaborationInfo: {
    init: CollaborationInfoInit;
    snapshot: CollaborationInfoSnapshot;
  };
  recipes: { init: RecipeInit; snapshot: RecipeSnapshot };
  recipeTagMetadata: {
    init: RecipeTagMetadataInit;
    snapshot: RecipeTagMetadataSnapshot;
  };
};
