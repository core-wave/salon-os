import { z } from "zod";

export const publicBookingSchema = z.object({
  appointmentTypeId: z.string().min(1, "Please select a service"),
  startsAt: z.string().min(1, "Please select a time"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
});

export type PublicBookingInput = z.infer<typeof publicBookingSchema>;
