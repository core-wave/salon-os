import z from "zod";

export const createOrganizationSchema = z.object({
  name: z.string("Please enter a valid name").min(3),
  slug: z
    .string()
    .min(3, "Please enter a valid slug")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and can only contain letters, numbers, and hyphens"
    ),
  userId: z.string(),
  placeId: z.string(),
  addressText: z.string(),
});

export type CreateOrganizationProps = z.infer<typeof createOrganizationSchema>;
