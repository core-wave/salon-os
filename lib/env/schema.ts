import { z } from "zod";

export const serverSchema = z.object({
  DATABASE_URL: z.url(),
  RESEND_API_KEY: z.string(),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_PLACES_API_KEY: z.string(),
  GRAVATAR_API_KEY: z.string(),
});

export const clientSchema = z.object({
  // NEXT_PUBLIC_SITE_URL: z.url(),
});
