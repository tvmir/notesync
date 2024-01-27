ALTER TABLE "files" RENAME COLUMN "user_id" TO "notebook_id";--> statement-breakpoint
ALTER TABLE "folders" RENAME COLUMN "user_id" TO "notebook_id";--> statement-breakpoint
ALTER TABLE "files" DROP CONSTRAINT "files_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "folders" DROP CONSTRAINT "folders_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notebooks" ADD COLUMN "in_trash" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_notebook_id_notebooks_id_fk" FOREIGN KEY ("notebook_id") REFERENCES "notebooks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "folders" ADD CONSTRAINT "folders_notebook_id_notebooks_id_fk" FOREIGN KEY ("notebook_id") REFERENCES "notebooks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
