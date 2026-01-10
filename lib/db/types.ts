import {
  appointments,
  appointmentTypes,
  locations,
  openingHourExceptions,
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
  "id" | "createdAt" | "organizationId" | "isActive"
>;

export type SelectLocation = Omit<
  typeof locations.$inferSelect,
  "organizationId"
>;

// Opening hours

export type InsertOpeningHour = Omit<
  typeof openingHours.$inferInsert,
  "id" | "createdAt" | "locationId"
>;

export type SelectOpeningHour = Omit<
  typeof openingHours.$inferSelect,
  "locationId"
>;

// Opening hours exceptions

export type InsertOpeningHourException = Omit<
  typeof openingHourExceptions.$inferInsert,
  "id" | "createdAt" | "locationId"
>;

export type SelectOpeningHourException = Omit<
  typeof openingHourExceptions.$inferSelect,
  "locationId"
>;

// Appointment Types

export type InsertAppointmentType = Omit<
  typeof appointmentTypes.$inferInsert,
  "id" | "createdAt" | "organizationId"
>;

export type SelectAppointmentType = Omit<
  typeof appointmentTypes.$inferSelect,
  "organizationId"
>;

// Appointments

export type InsertAppointment = Omit<
  typeof appointments.$inferInsert,
  "id" | "createdAt" | "locationId" | "status"
>;

export type SelectAppointment = Omit<
  typeof appointments.$inferSelect,
  "locationId" | "appointmentTypeId"
> & {
  appointmentType: SelectAppointmentType;
};
