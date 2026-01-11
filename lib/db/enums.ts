import { pgEnum } from "drizzle-orm/pg-core";

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "Planned",
  "Completed",
  "Cancelled",
  "No Show",
]);
