CREATE TABLE "opening_hour_slots" (
	"id" uuid PRIMARY KEY NOT NULL,
	"opening_hour_id" uuid NOT NULL,
	"opens_at" time NOT NULL,
	"closes_at" time NOT NULL
);
--> statement-breakpoint
ALTER TABLE "opening_hour_slots" ADD CONSTRAINT "opening_hour_slots_opening_hour_id_opening_hours_id_fk" FOREIGN KEY ("opening_hour_id") REFERENCES "public"."opening_hours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "opening_hour_slot_hour_idx" ON "opening_hour_slots" USING btree ("opening_hour_id");--> statement-breakpoint
CREATE UNIQUE INDEX "opening_hours_unique" ON "opening_hours" USING btree ("location_id","day_of_week");--> statement-breakpoint
ALTER TABLE "opening_hours" DROP COLUMN "opens_at";--> statement-breakpoint
ALTER TABLE "opening_hours" DROP COLUMN "closes_at";