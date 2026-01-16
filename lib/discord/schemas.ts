import z from "zod";

export const sendFeedbackSchema = z.object({
  text: z.string("Please enter a valid message").min(3),
});

export type SendFeedbackProps = z.infer<typeof sendFeedbackSchema>;
