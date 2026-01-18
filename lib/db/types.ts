import {
  appointments,
  appointmentTypes,
  customers,
  locations,
  member,
  openingHourExceptions,
  openingHourExceptionSlots,
  openingHours,
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
  "id" | "createdAt" | "isActive"
>;

export type SelectLocation = Omit<
  typeof locations.$inferSelect,
  "organizationId"
>;

// Opening hours

export type InsertOpeningHour = Omit<
  typeof openingHours.$inferInsert,
  "id" | "createdAt"
>;

export type SelectOpeningHour = Omit<
  typeof openingHours.$inferSelect,
  "locationId"
>;

// Opening hours exceptions

export type InsertOpeningHourException = Omit<
  typeof openingHourExceptions.$inferInsert,
  "id" | "createdAt"
>;

export type SelectOpeningHourException = Omit<
  typeof openingHourExceptions.$inferSelect,
  "locationId"
>;

export type InsertOpeningHourExceptionSlot = Omit<
  typeof openingHourExceptionSlots.$inferInsert,
  "id"
>;

export type SelectOpeningHourExceptionSlot = Omit<
  typeof openingHourExceptionSlots.$inferSelect,
  "exceptionId"
>;

// Appointment Types

export type InsertAppointmentType = Omit<
  typeof appointmentTypes.$inferInsert,
  "id" | "createdAt"
>;

export type SelectAppointmentType = Omit<
  typeof appointmentTypes.$inferSelect,
  "locationId"
>;

// Appointments

export type InsertAppointment = Omit<
  typeof appointments.$inferInsert,
  "id" | "createdAt" | "status"
>;

export type SelectAppointment = Omit<
  typeof appointments.$inferSelect,
  "locationId" | "appointmentTypeId"
> & {
  appointmentType: SelectAppointmentType;
  customer: SelectCustomer;
};

// Customers

export type SelectCustomer = Omit<
  typeof customers.$inferSelect,
  "organizationId"
>;
