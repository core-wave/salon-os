"use server";

import { User } from "better-auth";
import { resend } from "./client";
import { VerificationEmail } from "./templates";
import { pretty, render, toPlainText } from "@react-email/render";

interface SendVerificationEmailProps {
  user: User;
  url: string;
}

export async function sendVerificationEmail({
  user,
  url,
}: SendVerificationEmailProps) {
  console.log("sending email....");

  const verificationUrl = new URL(url);
  verificationUrl.searchParams.set("callbackURL", "/dashboard");

  const htmlEmail = await pretty(
    await render(VerificationEmail({ url: verificationUrl.toString(), user }))
  );

  const textEmail = toPlainText(htmlEmail);

  const res = await resend.emails.send({
    from: "SalonOS <security@auth.salonos.io>",
    to: user.email,
    subject: "Verify your email address",
    react: VerificationEmail({ user, url: verificationUrl.toString() }),
    html: htmlEmail,
    text: textEmail,
  });

  console.log(res);
}
