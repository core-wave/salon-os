"use server";

import z from "zod";
import { FormState } from "../types";
import { auth } from ".";
import { LoginProps, loginSchema, SignupProps, signupSchema } from "./schemas";
import { APIError } from "better-auth";
import { redirect } from "next/navigation";

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

  const parsed = signupSchema.safeParse(rawData);

  if (!parsed.success) {
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
  } catch (error) {
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

  return { status: "success", fieldValues: parsed.data };
}

export async function login(
  prevState: FormState<LoginProps>,
  formData: FormData
): Promise<FormState<LoginProps>> {
  const rawData: LoginProps = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  try {
    const res = await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });
  } catch (error) {
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

  redirect("/dashboard");
}

export async function logout(): Promise<boolean> {
  try {
    await auth.api.signOut();
  } catch (error) {
    return false;
  }

  redirect("/");
}
