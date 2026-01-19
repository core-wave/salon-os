ALTER TABLE "opening_hours" RENAME TO "opening_hour_slots";--> statement-breakpoint
DROP INDEX "opening_hours_location_idx";--> statement-breakpoint
ALTER TABLE "opening_hour_slots" DROP CONSTRAINT "opening_hours_location_id_locations_id_fk";--> statement-breakpoint
ALTER TABLE "opening_hour_slots" ADD COLUMN "opening_hour_id" uuid;--> statement-breakpoint

CREATE TABLE "opening_hours" (
	"id" uuid PRIMARY KEY NOT NULL,
	"location_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL
);--> statement-breakpoint
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "opening_hours_location_idx" ON "opening_hours" USING btree ("location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "opening_hours_unique" ON "opening_hours" USING btree ("location_id","day_of_week");--> statement-breakpoint

INSERT INTO "opening_hours" ("id", "location_id", "day_of_week")
SELECT DISTINCT ON ("location_id", "day_of_week")
  "id",
  "location_id",
  "day_of_week"
FROM "opening_hour_slots";--> statement-breakpoint

UPDATE "opening_hour_slots" AS slots
SET "opening_hour_id" = hours."id"
FROM "opening_hours" AS hours
WHERE slots."location_id" = hours."location_id"
  AND slots."day_of_week" = hours."day_of_week";--> statement-breakpoint

ALTER TABLE "opening_hour_slots" ALTER COLUMN "opening_hour_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "opening_hour_slots" DROP COLUMN "location_id";--> statement-breakpoint
ALTER TABLE "opening_hour_slots" DROP COLUMN "day_of_week";--> statement-breakpoint
ALTER TABLE "opening_hour_slots" ADD CONSTRAINT "opening_hour_slots_opening_hour_id_opening_hours_id_fk" FOREIGN KEY ("opening_hour_id") REFERENCES "public"."opening_hours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "opening_hour_slot_hour_idx" ON "opening_hour_slots" USING btree ("opening_hour_id");--> statement-breakpoint
