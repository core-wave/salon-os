"use server";

import z from "zod";
import { auth } from "../auth";
import { FormState } from "../types";
import { CreateOrganizationProps, createOrganizationSchema } from "./schemas";
import { APIError } from "better-auth";
import { redirect } from "next/navigation";

export async function createOrganization(
  prevState: FormState<CreateOrganizationProps>,
  formData: FormData
): Promise<FormState<CreateOrganizationProps>> {
  const rawData: CreateOrganizationProps = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    userId: formData.get("userId") as string,
  };

  const parsed = createOrganizationSchema.safeParse(rawData);

  if (!parsed.success) {
    console.log("parsing error");

    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  let organizationSlug = "";

  try {
    const res = await auth.api.createOrganization({
      body: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        userId: parsed.data.userId,
      },
    });

    if (res) {
      organizationSlug = res.slug;
    } else {
      return {
        status: "error",
        fieldValues: parsed.data,
        formErrors: ["An unknown error occurred"],
      };
    }
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error);

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

  return redirect(`/dashboard/${organizationSlug}`);
}
