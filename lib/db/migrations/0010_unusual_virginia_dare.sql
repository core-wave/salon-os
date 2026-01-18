ALTER TABLE "appointments" DROP CONSTRAINT "appointments_customer_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "appointment_user_idx";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "customer_id";