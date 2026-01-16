"use server";

import { User } from "better-auth";
import { serverEnv } from "../env/server";
import { FormState } from "../types";
import { SendFeedbackProps, sendFeedbackSchema } from "./schemas";
import { SelectOrganization } from "../db/types";
import z from "zod";

export async function discordSendFeedback(
  org: SelectOrganization,
  user: User,
  prevState: FormState<SendFeedbackProps>,
  formData: FormData
): Promise<FormState<SendFeedbackProps>> {
  const rawData: SendFeedbackProps = {
    text: formData.get("text") as string,
  };

  const parsed = sendFeedbackSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  try {
    await fetch(serverEnv.DISCORD_FEEDBACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            color: 0x5449d0, // Discord blurple
            fields: [
              { name: "Name", value: user.name, inline: true },
              { name: "Email", value: user.email, inline: true },
              { name: "Organization", value: org.name, inline: true },
              { name: "Message", value: parsed.data.text },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (error) {
    console.error(`[ERROR]:[discordSendFeedback]:`, error);
    return {
      status: "error",
      fieldValues: parsed.data,
    };
  }

  return {
    status: "success",
  };
}
