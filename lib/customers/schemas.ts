import z from "zod";

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z.string().optional()
);

export const customerFormSchema = z.object({
  name: z.string("Please enter a valid name").min(2),
  email: z.email("Please enter a valid email address"),
  phone: optionalText,
  notes: optionalText,
});

export type CustomerFormProps = z.infer<typeof customerFormSchema>;
