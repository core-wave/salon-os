ALTER TABLE "customers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "customers" CASCADE;--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "street" TO "address1";--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_customer_id_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "opening_hour_exceptions" DROP CONSTRAINT "opening_hour_exceptions_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "opening_hours" DROP CONSTRAINT "opening_hours_organization_id_organization_id_fk";
--> statement-breakpoint
DROP INDEX "appointment_org_idx";--> statement-breakpoint
ALTER TABLE "appointment_types" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "appointment_types" ALTER COLUMN "currency" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "appointment_types" ALTER COLUMN "is_active" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "appointment_types" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "is_active" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opening_hour_exceptions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opening_hour_exceptions" ALTER COLUMN "is_closed" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opening_hours" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opening_hours" ALTER COLUMN "is_closed" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "address2" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appointment_user_idx" ON "appointments" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "opening_exception_location_idx" ON "opening_hour_exceptions" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "opening_hours_location_idx" ON "opening_hours" USING btree ("location_id");--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "organization_id";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "ends_at";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "price_cents";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "opening_hour_exceptions" DROP COLUMN "organization_id";--> statement-breakpoint
ALTER TABLE "opening_hours" DROP COLUMN "organization_id";