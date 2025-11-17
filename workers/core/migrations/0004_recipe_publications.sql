-- Migration number: 0004 	 2025-11-17T15:56:30.915Z
CREATE TABLE IF NOT EXISTS "RecipePublication" (
	"id" TEXT PRIMARY KEY,
	"planId" TEXT NOT NULL,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"publicationName" TEXT,
	FOREIGN KEY ("planId") REFERENCES "RecipePlan"("id") ON DELETE CASCADE
);
