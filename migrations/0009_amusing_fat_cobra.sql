ALTER TABLE "files" RENAME COLUMN "data" TO "content";--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "content" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "folders" DROP COLUMN IF EXISTS "data";--> statement-breakpoint
ALTER TABLE "notebooks" DROP COLUMN IF EXISTS "data";