import z from "zod";

export const appointmentFormSchema = z.object({
  customerId: z.string("Please select a customer"),
  appointmentTypeId: z.string("Please select an appointment type"),
  startsAt: z.date("Please select a date"),
  notes: z.string("Please select an appointment type"),
});

export type AppointmentFormProps = z.infer<typeof appointmentFormSchema>;
