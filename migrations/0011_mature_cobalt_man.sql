CREATE TABLE IF NOT EXISTS "liked_songs" (
	"user_id" uuid NOT NULL,
	"song_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"like_count" smallint,
	CONSTRAINT "liked_songs_pkey" PRIMARY KEY("user_id","song_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"track_name" text,
	"artist" text,
	"song_file" text,
	"image_file" text,
	"genre" text
);
--> statement-breakpoint
ALTER TABLE "notebooks" ADD COLUMN "pomodoro_count" smallint;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liked_songs" ADD CONSTRAINT "liked_songs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liked_songs" ADD CONSTRAINT "liked_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
