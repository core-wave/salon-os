import z from "zod";

export const createAppointmentTypeSchema = z.object({
  name: z.string("Please enter a valid name").min(3),
  description: z.string().optional(),
  durationMinutes: z.number("Please enter a valid duration").min(1),
  price: z.number("Please enter a valid price").min(1),
  currency: z.string("Please enter a valid currency").length(3),
});

export type CreateAppointmentTypeProps = z.infer<
  typeof createAppointmentTypeSchema
>;
