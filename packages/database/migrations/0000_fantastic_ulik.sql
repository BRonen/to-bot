CREATE TABLE IF NOT EXISTS "to_read_keyword" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "to_read_keyword_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "to_read" (
	"id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(256) NOT NULL,
	"url" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"readed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "to_read_discord_id_unique" UNIQUE("discord_id"),
	CONSTRAINT "to_read_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "to_reads_to_keywords" (
	"to_read_id" integer NOT NULL,
	"to_read_keywords_id" integer NOT NULL,
	CONSTRAINT "to_reads_to_keywords_to_read_id_to_read_keywords_id_pk" PRIMARY KEY("to_read_id","to_read_keywords_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "to_reads_to_keywords" ADD CONSTRAINT "to_reads_to_keywords_to_read_id_to_read_id_fk" FOREIGN KEY ("to_read_id") REFERENCES "public"."to_read"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "to_reads_to_keywords" ADD CONSTRAINT "to_reads_to_keywords_to_read_keywords_id_to_read_keyword_id_fk" FOREIGN KEY ("to_read_keywords_id") REFERENCES "public"."to_read_keyword"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
