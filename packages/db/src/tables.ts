import {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from 'kysely';

export interface Database {
	User: UserTable;
	Account: AccountTable;
	Plan: PlanTable;
	PlanInvitation: PlanInvitationTable;
	ActivityLog: ActivityLogTable;
	VerificationCode: VerificationCodeTable;
	PushSubscription: PushSubscriptionTable;
	ChangelogItem: ChangelogItemTable;
	UserUsageLimit: UserUsageLimitTable;
	DomainRoute: DomainRouteTable;

	// app-specific data
	Food: FoodTable;
	FoodName: FoodNameTable;
	FoodCategoryAssignment: FoodCategoryAssignmentTable;
	FoodCategory: FoodCategoryTable;
	PublishedRecipe: PublishedRecipeTable;
	PublishedWishlist: PublishedWishlistTable;
	WishlistPurchase: WishlistPurchaseTable;
	WishlistIdeaRequest: WishlistIdeaRequestTable;
	PublishedNotebook: PublishedNotebookTable;
	PublishedPost: PublishedPostTable;
}

// date serialization: Dates go in, strings come out.
type DateColumnRequired = ColumnType<string, Date, Date>;
type DateColumnOptional = ColumnType<
	string | null,
	Date | undefined,
	Date | null | undefined
> | null;
type DateColumnGenerated = ColumnType<
	string,
	Date | undefined,
	Date | null | undefined
>;

type CreatedAt = DateColumnGenerated;
type UpdatedAt = DateColumnOptional;

export interface UserTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	fullName: string;
	friendlyName: string;
	email: string;
	emailVerifiedAt: string | null;
	imageUrl: string | null;

	password: string | null;
	isProductAdmin: boolean;

	/** The Stripe Customer associated with this user. */
	stripeCustomerId: string | null;

	planId: string | null;
	planRole: 'admin' | 'user' | null;

	preferences: ColumnType<
		Record<string, any>,
		Record<string, any> | undefined,
		Record<string, any> | undefined
	>;

	acceptedTosAt: ColumnType<Date, Date | undefined, Date | undefined> | null;
	sendEmailUpdates: ColumnType<boolean, boolean | undefined, boolean>;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface AccountTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	type: string;
	provider: string;
	providerAccountId: string;
	refreshToken: string | null;
	accessToken: string | null;
	tokenType: string | null;
	accessTokenExpiresAt: DateColumnOptional;
	scope: string | null;
	idToken: string | null;
	userId: string;
}

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type AccountUpdate = Updateable<AccountTable>;

export interface PlanTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	name: string;
	stripeProductId: string | null;
	stripePriceId: string | null;
	stripeSubscriptionId: string | null;
	subscriptionStatus: string | null;
	subscriptionStatusCheckedAt: DateColumnOptional;
	subscriptionExpiresAt: Date | null;
	subscriptionCanceledAt: Date | null;
	featureFlags: ColumnType<
		Record<string, boolean>,
		Record<string, boolean> | undefined,
		Record<string, boolean>
	>;
	memberLimit: Generated<number>;
	allowedApp: string | null;
}

export type Plan = Selectable<PlanTable>;
export type NewPlan = Insertable<PlanTable>;
export type PlanUpdate = Updateable<PlanTable>;

export interface PlanInvitationTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	planId: string;
	inviterId: string;
	inviterName: string;
	expiresAt: DateColumnRequired;
	claimedAt: DateColumnOptional;
	email: string;
}

export type PlanInvitation = Selectable<PlanInvitationTable>;
export type NewPlanInvitation = Insertable<PlanInvitationTable>;
export type PlanInvitationUpdate = Updateable<PlanInvitationTable>;

export interface VerificationCodeTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	code: string;
	email: string;
	name: string;
	expiresAt: DateColumnRequired;
}

export type VerificationCode = Selectable<VerificationCodeTable>;
export type NewVerificationCode = Insertable<VerificationCodeTable>;
export type VerificationCodeUpdate = Updateable<VerificationCodeTable>;

export interface ActivityLogTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	userId: string | null;
	action: string;
	data: string | null;
}

export type ActivityLog = Selectable<ActivityLogTable>;
export type NewActivityLog = Insertable<ActivityLogTable>;
export type ActivityLogUpdate = Updateable<ActivityLogTable>;

export interface PushSubscriptionTable {
	endpoint: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	appId: string;
	auth: string | null;
	p256dh: string | null;
	userId: string | null;
}

export type PushSubscription = Selectable<PushSubscriptionTable>;
export type NewPushSubscription = Insertable<PushSubscriptionTable>;
export type PushSubscriptionUpdate = Updateable<PushSubscriptionTable>;

export interface ChangelogItemTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	title: string;
	details: string;
	imageUrl: string | null;
	important: boolean;
	appId: string;
}

export type ChangelogItem = Selectable<ChangelogItemTable>;
export type NewChangelogItem = Insertable<ChangelogItemTable>;
export type ChangelogItemUpdate = Updateable<ChangelogItemTable>;

export interface FoodTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	canonicalName: string;
}

export type Food = Selectable<FoodTable>;
export type NewFood = Insertable<FoodTable>;
export type FoodUpdate = Updateable<FoodTable>;

export interface FoodNameTable {
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	name: string;
	foodId: string;
}

export type FoodName = Selectable<FoodNameTable>;
export type NewFoodName = Insertable<FoodNameTable>;
export type FoodNameUpdate = Updateable<FoodNameTable>;

export interface FoodCategoryAssignmentTable {
	foodId: string;
	categoryId: string;
	votes: number;
}

export type FoodCategoryAssignment = Selectable<FoodCategoryAssignmentTable>;
export type NewFoodCategoryAssignment = Insertable<FoodCategoryAssignmentTable>;
export type FoodCategoryAssignmentUpdate =
	Updateable<FoodCategoryAssignmentTable>;

export interface FoodCategoryTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	name: string;
	sortKey: string;
}

export type FoodCategory = Selectable<FoodCategoryTable>;
export type NewFoodCategory = Insertable<FoodCategoryTable>;
export type FoodCategoryUpdate = Updateable<FoodCategoryTable>;

export interface PublishedRecipeTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	publishedAt: DateColumnRequired;
	publishedBy: string;

	planId: string;
	slug: string;
}

export type PublishedRecipe = Selectable<PublishedRecipeTable>;
export type NewPublishedRecipe = Insertable<PublishedRecipeTable>;
export type PublishedRecipeUpdate = Updateable<PublishedRecipeTable>;

export interface PublishedWishlistTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	publishedAt: DateColumnRequired;
	publishedBy: string;

	planId: string;
	slug: string;
}

export type PublishedWishlist = Selectable<PublishedWishlistTable>;
export type NewPublishedWishlist = Insertable<PublishedWishlistTable>;
export type PublishedWishlistUpdate = Updateable<PublishedWishlistTable>;

export interface WishlistPurchaseTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
	confirmedAt: DateColumnOptional;

	wishlistId: string;
	itemId: string;
	purchasedBy: string;
	quantity: number;
}

export type WishlistPurchase = Selectable<WishlistPurchaseTable>;
export type NewWishlistPurchase = Insertable<WishlistPurchaseTable>;
export type WishlistPurchaseUpdate = Updateable<WishlistPurchaseTable>;

// a map of question id -> answer
export type WishlistIdeaRequestResponse = Record<string, string>;

export interface WishlistIdeaRequestTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	planId: string;
	wishlistId: string;
	requestedBy: string;
	receiverName: string;
	responseJson: WishlistIdeaRequestResponse | null;
}

export type WishlistIdeaRequest = Selectable<WishlistIdeaRequestTable>;
export type NewWishlistIdeaRequest = Insertable<WishlistIdeaRequestTable>;
export type WishlistIdeaRequestUpdate = Updateable<WishlistIdeaRequestTable>;

export interface UserUsageLimitTable {
	userId: string;
	limitType: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
	uses: number;
	resetsAt: DateColumnRequired;
}

export type UsageLimit = Selectable<UserUsageLimitTable>;
export type NewUsageLimit = Insertable<UserUsageLimitTable>;
export type UsageLimitUpdate = Updateable<UserUsageLimitTable>;

export interface PublishedNotebookTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	publishedBy: string;
	planId: string;
	name: string;
	iconUrl: string | null;
	coverImageUrl: string | null;
	description: RichTextNode | null;
}

export type PublishedNotebook = Selectable<PublishedNotebookTable>;
export type NewPublishedNotebook = Insertable<PublishedNotebookTable>;
export type PublishedNotebookUpdate = Updateable<PublishedNotebookTable>;

export interface PublishedPostTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	publishedBy: string;
	slug: string;
	notebookId: string;
	title: string;
	summary: string | null;
	coverImageUrl: string | null;
	body: RichTextNode;
}

export interface RichTextNode {
	type: string;
	attrs?: {
		[attribute: string]: unknown;
	} | null;
	content?: RichTextNode[] | null;
	marks?: RichTextNode[] | null;
	start?: number | null;
	end?: number | null;
	text?: string | null;
}

export type PublishedPost = Selectable<PublishedPostTable>;
export type NewPublishedPost = Insertable<PublishedPostTable>;
export type PublishedPostUpdate = Updateable<PublishedPostTable>;

export interface DomainRouteTable {
	id: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;

	domain: string;
	dnsVerifiedAt: DateColumnOptional;

	// for authorization
	planId: string;

	// routes are decided dynamically based on the app and resource routed to.
	appId: string;
	resourceId: string;
}

export type DomainRoute = Selectable<DomainRouteTable>;
export type NewDomainRoute = Insertable<DomainRouteTable>;
export type DomainRouteUpdate = Updateable<DomainRouteTable>;
