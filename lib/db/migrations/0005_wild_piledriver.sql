ALTER TABLE "appointment_types" DROP CONSTRAINT "appointment_types_organization_id_organization_id_fk";
--> statement-breakpoint
DROP INDEX "appt_type_org_idx";--> statement-breakpoint
ALTER TABLE "appointment_types" ADD COLUMN "location_id" uuid DEFAULT '019b9ff6-45ef-762f-81aa-b3e24742ead4' NOT NULL;--> statement-breakpoint
ALTER TABLE "appointment_types" ADD CONSTRAINT "appointment_types_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appt_type_loc_idx" ON "appointment_types" USING btree ("location_id");--> statement-breakpoint
ALTER TABLE "appointment_types" DROP COLUMN "organization_id";