import z from "zod";

export const createOrganizationSchema = z.object({
  name: z.string("Please enter a valid name"),
  slug: z
    .string()
    .min(1, "Please enter a valid slug")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and can only contain letters, numbers, and hyphens"
    ),
  userId: z.string(),
});

export type CreateOrganizationProps = z.infer<typeof createOrganizationSchema>;
