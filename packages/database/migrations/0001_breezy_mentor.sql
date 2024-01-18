CREATE TABLE IF NOT EXISTS "to_do_cron_rule" (
	"id" integer NOT NULL,
	"tag" varchar(32) NOT NULL,
	"disabled" boolean DEFAULT false NOT NULL,
	"runned_at" timestamp,
	CONSTRAINT "to_do_cron_rule_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "to_do" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" varchar(128) NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"status" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "to_do_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
ALTER TABLE "to_read" ALTER COLUMN "discord_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "to_do_cron_rule" ADD CONSTRAINT "to_do_cron_rule_id_to_do_id_fk" FOREIGN KEY ("id") REFERENCES "public"."to_do"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
