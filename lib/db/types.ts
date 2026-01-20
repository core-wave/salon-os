import {
  appointments,
  appointmentTypes,
  customers,
  locations,
  member,
  openingHourExceptions,
  openingHourExceptionSlots,
  openingHours,
  openingHourSlots,
  organization,
} from "./schema";

// Organizations

export type InsertOrganization = Omit<
  typeof organization.$inferInsert,
  "id" | "createdAt" | "logo" | "metadata"
>;

export type SelectOrganization = Omit<
  typeof organization.$inferSelect,
  "logo" | "metadata"
>;

// Locations

export type InsertLocation = Omit<
  typeof locations.$inferInsert,
  "id" | "createdAt" | "isActive" | "organizationId"
>;

export type SelectLocation = Omit<
  typeof locations.$inferSelect,
  "organizationId"
>;

// Opening hours

export type InsertOpeningHour = Omit<
  typeof openingHours.$inferInsert,
  "id" | "locationId"
> & {
  slots: InsertOpeningHourSlot[];
};

export type SelectOpeningHour = Omit<
  typeof openingHours.$inferSelect,
  "locationId"
> & {
  slots: SelectOpeningHourSlot[];
};

export type InsertOpeningHourSlot = Omit<
  typeof openingHourSlots.$inferInsert,
  "id" | "openingHourId"
>;

export type SelectOpeningHourSlot = Omit<
  typeof openingHourSlots.$inferSelect,
  "openingHourId"
>;

// Opening hours exceptions

export type InsertOpeningHourException = Omit<
  typeof openingHourExceptions.$inferInsert,
  "id" | "createdAt" | "locationId"
> & { slots: InsertOpeningHourExceptionSlot[] };

export type SelectOpeningHourException = Omit<
  typeof openingHourExceptions.$inferSelect,
  "locationId"
> & {
  slots: SelectOpeningHourExceptionSlot[];
};

export type InsertOpeningHourExceptionSlot = Omit<
  typeof openingHourExceptionSlots.$inferInsert,
  "id" | "exceptionId"
>;

export type SelectOpeningHourExceptionSlot = Omit<
  typeof openingHourExceptionSlots.$inferSelect,
  "exceptionId"
>;

// Appointment Types

export type InsertAppointmentType = Omit<
  typeof appointmentTypes.$inferInsert,
  "id" | "createdAt" | "locationId"
>;

export type SelectAppointmentType = Omit<
  typeof appointmentTypes.$inferSelect,
  "locationId"
>;

// Appointments

export type InsertAppointment = Omit<
  typeof appointments.$inferInsert,
  "id" | "createdAt" | "status" | "locationId"
>;

export type SelectAppointment = Omit<
  typeof appointments.$inferSelect,
  "locationId" | "appointmentTypeId" | "customerId"
> & {
  appointmentType: SelectAppointmentType;
  customer: SelectCustomer;
};

// Customers

export type SelectCustomer = Omit<
  typeof customers.$inferSelect,
  "organizationId"
>;

export type InsertCustomer = Omit<
  typeof customers.$inferInsert,
  "id" | "createdAt" | "organizationId"
>;
