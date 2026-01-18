import z from "zod";

const openingHourSlotSchema = z.object({
  opensAt: z.string().min(1, "Please enter a start time"),
  closesAt: z.string().min(1, "Please enter an end time"),
});

export const openingHoursFormSchema = (slotCount: number) =>
  z.object({
    dayOfWeek: z.number().int().min(0).max(6),

    slots: z.array(openingHourSlotSchema).length(slotCount),
  });

export type OpeningHoursFormProps = z.infer<
  ReturnType<typeof openingHoursFormSchema>
>;

export const openingHourExceptionFormSchema = (slotCount: number) =>
  z.object({
    date: z.string().min(1, "Please select a date"),
    remark: z.string().optional(),
    slots: z.array(openingHourSlotSchema).length(slotCount),
  });

export type OpeningHourExceptionFormProps = z.infer<
  ReturnType<typeof openingHourExceptionFormSchema>
>;
