import z from "zod";

export const appointmentFormSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  appointmentTypeId: z.string().min(1, "Please select an appointment type"),
  startsAt: z.date({ message: "Please select a date and time" }),
  notes: z.string().optional(),
});

export type AppointmentFormProps = z.infer<typeof appointmentFormSchema>;
