ALTER TABLE "appointment_types" ALTER COLUMN "is_active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "appointment_types" ALTER COLUMN "created_at" SET DEFAULT now();