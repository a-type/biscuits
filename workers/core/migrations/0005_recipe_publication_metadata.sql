-- Migration number: 0005 	 2025-11-17T21:38:25.182Z
ALTER TABLE "RecipePublication"
ADD COLUMN "publishedAt" DATETIME DEFAULT null;
ALTER TABLE "RecipePublication"
ADD COLUMN "description" TEXT DEFAULT null;
