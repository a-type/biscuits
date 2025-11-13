-- Migration number: 0003 	 2025-11-11T21:41:49.413Z
ALTER TABLE "PublishedRecipe"
ADD COLUMN "data" TEXT NOT NULL DEFAULT '{}';
