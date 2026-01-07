ALTER TABLE "locations" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_slug_unique" UNIQUE("slug");