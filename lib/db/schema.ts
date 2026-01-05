import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  date,
  time,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export * from "./auth";

import { organization } from "./auth";

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 255 }).notNull(), // e.g. "Main salon"

    street: varchar("street", { length: 255 }).notNull(),
    postalCode: varchar("postal_code", { length: 32 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    country: varchar("country", { length: 2 }).notNull(),

    phone: varchar("phone", { length: 32 }),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("location_org_idx").on(t.organizationId)]
);

export const openingHours = pgTable(
  "opening_hours",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id),

    // 0 = Sunday, 6 = Saturday
    dayOfWeek: integer("day_of_week").notNull(),

    opensAt: time("opens_at"),
    closesAt: time("closes_at"),

    isClosed: boolean("is_closed").default(false).notNull(),
  },
  (t) => [uniqueIndex("opening_hours_unique").on(t.locationId, t.dayOfWeek)]
);

export const openingHourExceptions = pgTable(
  "opening_hour_exceptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id),

    date: date("date").notNull(),

    opensAt: time("opens_at"),
    closesAt: time("closes_at"),

    isClosed: boolean("is_closed").default(false).notNull(),

    reason: varchar("reason", { length: 255 }),
  },
  (t) => [uniqueIndex("opening_exception_unique").on(t.locationId, t.date)]
);

export const appointmentTypes = pgTable(
  "appointment_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),

    durationMinutes: integer("duration_minutes").notNull(),

    priceCents: integer("price_cents").notNull(),
    currency: varchar("currency", { length: 3 }).default("EUR").notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("appt_type_org_idx").on(t.organizationId)]
);

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    userId: varchar("user_id", { length: 255 }), // BetterAuth user (optional)

    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 32 }),

    notes: text("notes"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("customer_org_idx").on(t.organizationId),
    index("customer_email_idx").on(t.email),
  ]
);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id),

    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),

    appointmentTypeId: uuid("appointment_type_id")
      .notNull()
      .references(() => appointmentTypes.id),

    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),

    status: varchar("status", { length: 32 }).default("scheduled").notNull(),

    // Snapshot pricing
    priceCents: integer("price_cents").notNull(),
    currency: varchar("currency", { length: 3 }).default("EUR").notNull(),

    notes: text("notes"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("appointment_org_idx").on(t.organizationId),
    index("appointment_location_idx").on(t.locationId),
    index("appointment_start_idx").on(t.startsAt),
  ]
);
