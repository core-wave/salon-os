"use server";

import z from "zod";
import { FormState } from "../types";
import { salonCore } from "../core";
import { revalidatePath } from "next/cache";
import { AppointmentTypeFormProps, appointmentTypeFormSchema } from "./schemas";

export async function deleteAppointmentType(
  id: string,
  prevState: "default" | "error" | "success"
): Promise<"default" | "error" | "success"> {
  const success = await salonCore.deleteAppointmentType(id);

  if (!success) {
    return "error";
  }

  revalidatePath("/");

  return "success";
}

export async function createAppointmentType(
  locationId: string,
  prevState: FormState<AppointmentTypeFormProps>,
  formData: FormData
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
    console.error("parsing error in createAppointmentType:", parsed.error);
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
  prevState: FormState<AppointmentTypeFormProps>,
  formData: FormData
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
