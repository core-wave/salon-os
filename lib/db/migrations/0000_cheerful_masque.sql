CREATE TABLE "appointment_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"duration_minutes" integer NOT NULL,
	"price_cents" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"location_id" uuid NOT NULL,
	"customer_id" text NOT NULL,
	"appointment_type_id" uuid NOT NULL,
	"starts_at" timestamp NOT NULL,
	"status" varchar(32) NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" text NOT NULL,
	"placeId" text NOT NULL,
	"formattedAddress" text NOT NULL,
	"googleMapsUri" text NOT NULL,
	"timeZone" text NOT NULL,
	"streetName" text,
	"streetNumber" text,
	"postalCode" text,
	"city" text NOT NULL,
	"administrativeArea" text,
	"countryCode" text NOT NULL,
	"lat" integer NOT NULL,
	"lng" integer NOT NULL,
	"phone" varchar(32),
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opening_hour_exceptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"location_id" uuid NOT NULL,
	"date" date NOT NULL,
	"opens_at" time,
	"closes_at" time,
	"is_closed" boolean NOT NULL,
	"reason" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "opening_hours" (
	"id" uuid PRIMARY KEY NOT NULL,
	"location_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"opens_at" time,
	"closes_at" time,
	"is_closed" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointment_types" ADD CONSTRAINT "appointment_types_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_appointment_type_id_appointment_types_id_fk" FOREIGN KEY ("appointment_type_id") REFERENCES "public"."appointment_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opening_hour_exceptions" ADD CONSTRAINT "opening_hour_exceptions_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appt_type_org_idx" ON "appointment_types" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "appointment_user_idx" ON "appointments" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "appointment_location_idx" ON "appointments" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "appointment_start_idx" ON "appointments" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "location_org_idx" ON "locations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "opening_exception_location_idx" ON "opening_hour_exceptions" USING btree ("location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "opening_exception_unique" ON "opening_hour_exceptions" USING btree ("location_id","date");--> statement-breakpoint
CREATE INDEX "opening_hours_location_idx" ON "opening_hours" USING btree ("location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "opening_hours_unique" ON "opening_hours" USING btree ("location_id","day_of_week");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_uidx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");