ALTER TABLE "appointments" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "opening_hour_exceptions" ALTER COLUMN "is_closed" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "opening_hours" ALTER COLUMN "is_closed" SET DEFAULT true;