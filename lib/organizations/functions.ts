"use server";

import z from "zod";
import { FormState } from "../types";
import { CreateOrganizationProps, createOrganizationSchema } from "./schemas";
import { APIError } from "better-auth";
import { redirect } from "next/navigation";
import { salonCore } from "../core";
import { getPlaceDetails } from "../google/functions";
import { slugify } from "../utils";

export async function createOrganization(
  prevState: FormState<CreateOrganizationProps>,
  formData: FormData
): Promise<FormState<CreateOrganizationProps>> {
  const rawData: CreateOrganizationProps = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    userId: formData.get("userId") as string,
    placeId: formData.get("placeId") as string,
    addressText: formData.get("addressText") as string,
  };

  const parsed = createOrganizationSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  let organizationSlug = "";

  try {
    const [org, placeDetails] = await Promise.all([
      salonCore.createOrganization(
        parsed.data.slug,
        parsed.data.name,
        parsed.data.userId
      ),
      getPlaceDetails(parsed.data.placeId),
    ]);

    console.log(org, placeDetails);

    if (!org || !placeDetails) {
      return {
        status: "error",
        fieldValues: parsed.data,
        formErrors: ["An unknown error occurred"],
      };
    }

    const location = await org.createLocation({
      name: placeDetails.city,
      slug: slugify(placeDetails.city),
      organizationId: org.id,
      ...placeDetails,
    });

    if (!location) {
      return {
        status: "error",
        fieldValues: parsed.data,
        formErrors: ["An unknown error occurred"],
      };
    }

    organizationSlug = org.slug;
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

  return redirect(`/dashboard/${organizationSlug}`);
}
