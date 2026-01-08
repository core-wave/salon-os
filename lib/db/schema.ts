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

import { v7 as uuidv7 } from "uuid";

export * from "./auth";

import { organization, user } from "./auth";

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").primaryKey().$defaultFn(uuidv7),

    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id),

    name: varchar("name", { length: 255 }).notNull(), // e.g. "Main salon"

    slug: text("slug").notNull().unique(),

    address1: varchar("address1", { length: 255 }).notNull(),
    address2: varchar("address2", { length: 255 }),

    postalCode: varchar("postal_code", { length: 32 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    country: varchar("country", { length: 2 }).notNull(),

    phone: varchar("phone", { length: 32 }),

    isActive: boolean("is_active").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("location_org_idx").on(t.organizationId)]
);

export type InsertLocation = typeof locations.$inferInsert;

export const openingHours = pgTable(
  "opening_hours",
  {
    id: uuid("id").primaryKey(),

    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id),

    // 0 = Sunday, 6 = Saturday
    dayOfWeek: integer("day_of_week").notNull(),

    opensAt: time("opens_at"),
    closesAt: time("closes_at"),

    isClosed: boolean("is_closed").notNull(),
  },
  (t) => [
    index("opening_hours_location_idx").on(t.locationId),
    uniqueIndex("opening_hours_unique").on(t.locationId, t.dayOfWeek),
  ]
);

export const openingHourExceptions = pgTable(
  "opening_hour_exceptions",
  {
    id: uuid("id").primaryKey(),

    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id),

    date: date("date").notNull(),

    opensAt: time("opens_at"),
    closesAt: time("closes_at"),

    isClosed: boolean("is_closed").notNull(),

    remark: varchar("reason", { length: 255 }),
  },
  (t) => [
    index("opening_exception_location_idx").on(t.locationId),
    uniqueIndex("opening_exception_unique").on(t.locationId, t.date),
  ]
);

export const appointmentTypes = pgTable(
  "appointment_types",
  {
    id: uuid("id").primaryKey(),

    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),

    durationMinutes: integer("duration_minutes").notNull(),

    price: integer("price_cents").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),

    isActive: boolean("is_active").notNull(),

    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [index("appt_type_org_idx").on(t.organizationId)]
);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey(),

    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id),

    customerId: uuid("customer_id")
      .notNull()
      .references(() => user.id),

    appointmentTypeId: uuid("appointment_type_id")
      .notNull()
      .references(() => appointmentTypes.id),

    startsAt: timestamp("starts_at").notNull(),

    status: varchar("status", { length: 32 }).notNull(),

    notes: text("notes"),

    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [
    index("appointment_user_idx").on(t.customerId),
    index("appointment_location_idx").on(t.locationId),
    index("appointment_start_idx").on(t.startsAt),
  ]
);
