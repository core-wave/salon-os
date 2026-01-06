import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "@/lib/db/index";
import * as schema from "@/lib/db/schema";
import { sendVerificationEmail } from "../email/functions";
import { redirect } from "next/navigation";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url, token }, request) {
      await sendVerificationEmail({
        user,
        url,
      });
    },
  },

  plugins: [
    organization({
      // optional config
      allowUserToCreateOrganization: true,
    }),
  ],
});
