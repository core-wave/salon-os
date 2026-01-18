CREATE TABLE "opening_hour_exception_slots" (
	"id" uuid PRIMARY KEY NOT NULL,
	"exception_id" uuid NOT NULL,
	"opens_at" time NOT NULL,
	"closes_at" time NOT NULL
);
--> statement-breakpoint
ALTER TABLE "opening_hour_exception_slots" ADD CONSTRAINT "opening_hour_exception_slots_exception_id_opening_hour_exceptions_id_fk" FOREIGN KEY ("exception_id") REFERENCES "public"."opening_hour_exceptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "opening_exception_slot_exception_idx" ON "opening_hour_exception_slots" USING btree ("exception_id");--> statement-breakpoint
ALTER TABLE "opening_hour_exceptions" DROP COLUMN "opens_at";--> statement-breakpoint
ALTER TABLE "opening_hour_exceptions" DROP COLUMN "closes_at";