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
  locationId: string,
  prevState: FormState<CreateAppointmentTypeProps>,
  formData: FormData
): Promise<FormState<CreateAppointmentTypeProps>> {
  const rawData: CreateAppointmentTypeProps = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    durationMinutes: Number(formData.get("durationMinutes")),
    price: Number(formData.get("price")),
    currency: formData.get("currency") as string,
    isActive: Boolean(formData.get("isActive")),
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

  const success = await salonCore.createAppointmentType({
    ...parsed.data,
    locationId,
  });

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

export async function updateAppointmentType(
  id: string,
  prevState: FormState<CreateAppointmentTypeProps>,
  formData: FormData
): Promise<FormState<CreateAppointmentTypeProps>> {
  const rawData: CreateAppointmentTypeProps = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    durationMinutes: Number(formData.get("durationMinutes")),
    price: Number(formData.get("price")),
    currency: formData.get("currency") as string,
    isActive: Boolean(formData.get("isActive")),
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

  const success = await salonCore.updateAppointmentType(id, parsed.data);

  if (!success) {
    return {
      status: "error",
      fieldValues: parsed.data,
      formErrors: ["error updating appointment type"],
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    fieldValues: parsed.data,
  };
}
