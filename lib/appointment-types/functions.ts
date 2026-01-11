"use server";

import z from "zod";
import { FormState } from "../types";
import { salonCore } from "../core";
import {
  CreateAppointmentTypeProps,
  createAppointmentTypeSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";

export async function createAppointmentType(
  prevState: FormState<CreateAppointmentTypeProps>,
  formData: FormData
): Promise<FormState<CreateAppointmentTypeProps>> {
  const rawData: CreateAppointmentTypeProps = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    durationMinutes: Number(formData.get("durationMinutes")),
    price: Number(formData.get("price")),
    currency: formData.get("currency") as string,
  };

  const parsed = createAppointmentTypeSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error("parsing error:", parsed.error);
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const org = await salonCore.getOrganizationBySlug("grote-fok2");
  if (!org)
    return {
      status: "error",
      fieldValues: parsed.data,
      formErrors: ["organization does not exist"],
    };

  const availableLocations = await org.listLocations();
  if (!availableLocations)
    return {
      status: "error",
      fieldValues: parsed.data,
      formErrors: ["organization does not have locations"],
    };

  const location = await org.getLocation(availableLocations[0].id);
  if (!location)
    return {
      status: "error",
      fieldValues: parsed.data,
      formErrors: ["location does not exist"],
    };

  const success = await location.createAppointmentType(parsed.data);

  if (!success) {
    return {
      status: "error",
      fieldValues: parsed.data,
      formErrors: ["error creating appointment type"],
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    fieldValues: parsed.data,
  };
}
