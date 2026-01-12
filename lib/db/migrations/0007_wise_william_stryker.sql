ALTER TABLE "opening_hours" ALTER COLUMN "opens_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "opening_hours" ALTER COLUMN "closes_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "opening_hours" DROP COLUMN "is_closed";