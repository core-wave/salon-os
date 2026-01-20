"use server";

import z from "zod";
import { FormState } from "../types";
import { salonCore } from "../core";
import { revalidatePath } from "next/cache";
import { AppointmentTypeFormProps, appointmentTypeFormSchema } from "./schemas";

export async function deleteAppointmentType(
  locationSlug: string,
  id: string,
  prevState: "default" | "error" | "success",
): Promise<"default" | "error" | "success"> {
  const loc = await salonCore.getLocationBySlug(locationSlug);
  if (!loc) return "error";

  const success = await loc.deleteAppointmentType(id);

  if (!success) {
    return "error";
  }

  return "success";
}

export async function createAppointmentType(
  locationSlug: string,
  currency: string,
  prevState: FormState<AppointmentTypeFormProps>,
  formData: FormData,
): Promise<FormState<AppointmentTypeFormProps>> {
  const rawData: AppointmentTypeFormProps = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    durationMinutes: Number(formData.get("durationMinutes")),
    price: Number(formData.get("price")),
    currency: currency,
    isActive: Boolean(formData.get("isActive")),
  };

  const parsed = appointmentTypeFormSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error("parsing error in createAppointmentType:", parsed.error);
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const loc = await salonCore.getLocationBySlug(locationSlug);
  if (!loc)
    return {
      status: "error",
      fieldValues: parsed.data,
    };

  const success = await loc.createAppointmentType(parsed.data);

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
  };
}

export async function updateAppointmentType(
  locationSlug: string,
  id: string,
  prevState: FormState<AppointmentTypeFormProps>,
  formData: FormData,
): Promise<FormState<AppointmentTypeFormProps>> {
  const rawData: AppointmentTypeFormProps = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    durationMinutes: Number(formData.get("durationMinutes")),
    price: Number(formData.get("price")),
    currency: formData.get("currency") as string,
    isActive: Boolean(formData.get("isActive")),
  };

  const parsed = appointmentTypeFormSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error("parsing error in updateAppointmentType:", parsed.error);
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const loc = await salonCore.getLocationBySlug(locationSlug);
  if (!loc)
    return {
      status: "error",
      fieldValues: parsed.data,
    };

  const success = await loc.updateAppointmentType(id, parsed.data);

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
