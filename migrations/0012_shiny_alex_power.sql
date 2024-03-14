CREATE TABLE IF NOT EXISTS "recommended_songs" (
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"song_id" uuid NOT NULL,
	CONSTRAINT "recommended_songs_pkey" PRIMARY KEY("user_id","song_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"task" text NOT NULL,
	"status" text NOT NULL,
	"notebook_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notebooks" RENAME COLUMN "notebook_user" TO "user_id";--> statement-breakpoint
ALTER TABLE "notebooks" ALTER COLUMN "pomodoro_count" SET DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notebooks" ADD CONSTRAINT "notebooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN IF EXISTS "in_trash";--> statement-breakpoint
ALTER TABLE "folders" DROP COLUMN IF EXISTS "in_trash";--> statement-breakpoint
ALTER TABLE "notebooks" DROP COLUMN IF EXISTS "in_trash";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recommended_songs" ADD CONSTRAINT "recommended_songs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recommended_songs" ADD CONSTRAINT "recommended_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_notebook_id_notebooks_id_fk" FOREIGN KEY ("notebook_id") REFERENCES "notebooks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
