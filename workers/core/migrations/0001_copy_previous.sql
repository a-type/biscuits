-- Migration number: 0001 	 2025-10-03T16:48:36.721Z
CREATE TABLE "Account" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"type" text not null,
	"provider" text not null,
	"providerAccountId" text not null,
	"refreshToken" text,
	"accessToken" text,
	"tokenType" text,
	"accessTokenExpiresAt" datetime,
	"scope" text,
	"idToken" text,
	"userId" text not null references "User" ("id") on delete cascade
);
CREATE TABLE "ActivityLog" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"userId" varchar,
	"action" text not null,
	"data" text
);
CREATE TABLE "ChangelogItem" (
	"id" varchar not null primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"title" varchar not null,
	"details" text not null,
	"imageUrl" varchar,
	"important" boolean not null,
	"appId" varchar default 'gnocchi' not null
);
CREATE TABLE "DomainRoute" (
	"id" text,
	"createdAt" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"domain" text NOT NULL UNIQUE,
	"dnsVerifiedAt" datetime,
	"planId" text NOT NULL,
	"appId" text NOT NULL,
	"resourceId" text NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("planId") REFERENCES "Plan"("id") on delete cascade
);
CREATE TABLE "Food" (
	"id" varchar primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"canonicalName" varchar not null unique
);
CREATE TABLE "FoodCategory" (
	"id" varchar primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"name" varchar not null unique,
	"sortKey" varchar not null
);
CREATE TABLE "FoodCategoryAssignment" (
	"foodId" varchar not null references "Food" ("id") on delete cascade,
	"categoryId" varchar not null references "FoodCategory" ("id") on delete cascade,
	"votes" integer default 1 not null,
	constraint "FoodCategoryAssignment_categoryId_foodId" unique ("categoryId", "foodId")
);
CREATE TABLE "FoodName" (
	"name" varchar not null primary key,
	"foodId" varchar not null references "Food" ("id") on delete cascade,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null
);
CREATE TABLE "Plan" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"name" text default 'Your Plan' not null,
	"stripeProductId" text,
	"stripePriceId" text,
	"stripeSubscriptionId" text,
	"subscriptionStatus" text,
	"subscriptionStatusCheckedAt" datetime,
	"subscriptionExpiresAt" datetime,
	"subscriptionCanceledAt" datetime,
	"featureFlags" text default '{}' not null,
	"memberLimit" integer default 1,
	"allowedApp" text
);
CREATE TABLE "PlanInvitation" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"planId" text not null references "Plan" ("id") on delete cascade,
	"inviterId" text not null references "User" ("id"),
	"inviterName" text not null,
	"expiresAt" datetime not null,
	"claimedAt" datetime,
	"email" text not null
);
CREATE TABLE "PublishedNotebook" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"publishedBy" text not null references "User" ("id") on delete cascade,
	"planId" text not null,
	"name" text not null,
	"coverImageUrl" text,
	"iconUrl" text,
	"description" text,
	"theme" text
);
CREATE TABLE "PublishedPost" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"publishedBy" text not null references "User" ("id") on delete cascade,
	"notebookId" text not null references "PublishedNotebook" ("id") on delete cascade,
	"slug" text not null,
	"title" text not null,
	"coverImageUrl" text,
	"summary" text,
	"body" text,
	constraint "PublishedPost_notebookId_slug_unique" unique ("notebookId", "slug")
);
CREATE TABLE "PublishedRecipe" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"publishedAt" datetime,
	"publishedBy" text not null references "User" ("id"),
	"planId" text not null,
	"slug" text not null,
	constraint "PublishedRecipe_planId_slug_unique" unique ("planId", "slug")
);
CREATE TABLE "PublishedWishlist" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"publishedAt" datetime,
	"publishedBy" text not null references "User" ("id") on delete cascade,
	"planId" text not null,
	"slug" text not null unique
);
CREATE TABLE "PushSubscription" (
	"endpoint" varchar not null primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"auth" varchar,
	"p256dh" varchar,
	"userId" varchar,
	"appId" varchar default 'gnocchi' not null
);
CREATE TABLE "User" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"fullName" text not null,
	"friendlyName" text not null,
	"email" text not null unique,
	"imageUrl" text,
	"password" text,
	"isProductAdmin" boolean not null,
	"stripeCustomerId" text,
	"planId" text references "Plan" ("id") on delete
	set null,
		"planRole" text,
		"emailVerifiedAt" datetime,
		"preferences" text default '{}' not null,
		"acceptedTosAt" datetime,
		"sendEmailUpdates" boolean default 'false' not null
);
CREATE TABLE "UserUsageLimit" (
	"userId" text not null references "User" ("id") on delete cascade,
	"limitType" text not null,
	"uses" integer default 0 not null,
	"resetsAt" datetime not null,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	constraint "UserUsageLimit_pk" primary key ("userId", "limitType")
);
CREATE TABLE "VerificationCode" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"email" text not null,
	"code" text not null,
	"name" text not null,
	"expiresAt" datetime not null
);
CREATE TABLE "WishlistPurchase" (
	"id" text primary key,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"wishlistId" text not null references "PublishedWishlist" ("id") on delete cascade,
	"purchasedBy" text not null,
	"quantity" integer default 1 not null,
	"confirmedAt" datetime,
	"itemId" text not null
);
-- indexes
CREATE INDEX "Account_providerAccountId" on "Account" ("providerAccountId");
CREATE INDEX "ChangelogItem_appId" on "ChangelogItem" ("appId");
CREATE INDEX "DomainRoute_appId_resourceId_index" on "DomainRoute" ("appId", "resourceId");
CREATE INDEX "Plan_stripeSubscriptionId" on "Plan" ("stripeSubscriptionId");
CREATE INDEX "PublishedRecipe_slug" on "PublishedRecipe" ("planId", "slug");
CREATE UNIQUE INDEX "User_email" on "User" ("email");
CREATE UNIQUE INDEX "VerificationCode_code" on "VerificationCode" ("code");
