"use server";

import z from "zod";
import { FormState } from "../types";
import { auth } from ".";
import { SignupProps, signupSchema } from "./schemas";
import { APIError } from "better-auth";

export async function signup(
  prevState: FormState<SignupProps>,
  formData: FormData
): Promise<FormState<SignupProps>> {
  const rawData: SignupProps = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    name: formData.get("name") as string,
  };

  console.log("rawData:", rawData);

  const parsed = signupSchema.safeParse(rawData);

  console.log("parsed:", parsed);

  if (!parsed.success) {
    console.log("parsing error");
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
      },
    });

    console.log("res:", res);
  } catch (error) {
    console.log("error:", error);

    if (error instanceof APIError) {
      const message = String(error.message);

      return {
        status: "error",
        fieldValues: parsed.data,
        formErrors: [message],
      };
    }
    return {
      status: "error",
      fieldValues: parsed.data,
      formErrors: ["An unknown error occurred"],
    };
  }

  console.log("success");

  return { status: "success", fieldValues: parsed.data };
}
