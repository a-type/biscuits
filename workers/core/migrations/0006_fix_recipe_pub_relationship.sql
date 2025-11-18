-- Migration number: 0006 	 2025-11-18T18:29:49.612Z
CREATE TABLE "RecipePublication_Temp" (
	"id" TEXT PRIMARY KEY,
	"planId" TEXT NOT NULL,
	"createdAt" datetime default CURRENT_TIMESTAMP not null,
	"updatedAt" datetime default CURRENT_TIMESTAMP not null,
	"publicationName" TEXT,
	"publishedAt" DATETIME DEFAULT null,
	"description" TEXT DEFAULT null,
	FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE
);
INSERT INTO "RecipePublication_Temp" (
		"id",
		"planId",
		"createdAt",
		"updatedAt",
		"publicationName",
		"publishedAt",
		"description"
	)
SELECT "id",
	"planId",
	"createdAt",
	"updatedAt",
	"publicationName",
	"publishedAt",
	"description"
FROM "RecipePublication";
DROP TABLE "RecipePublication";
ALTER TABLE "RecipePublication_Temp"
	RENAME TO "RecipePublication";
