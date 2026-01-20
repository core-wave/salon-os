"use server";

import z from "zod";
import { FormState } from "../types";
import { AppointmentFormProps, appointmentFormSchema } from "./schemas";
import { salonCore } from "../core";
import { revalidatePath } from "next/cache";
import { nextQuarterHour } from "../utils";

export async function createAppointment(
  locationSlug: string,
  currency: string,
  prevState: FormState<AppointmentFormProps>,
  formData: FormData,
): Promise<FormState<AppointmentFormProps>> {
  const raw = Object.fromEntries(formData);

  console.log(raw);

  const rawData: AppointmentFormProps = {
    appointmentTypeId: formData.get("appointmentTypeId") as string,
    customerId: formData.get("customerId") as string,
    startsAt: nextQuarterHour(), // hardcoded, remove later
    notes: formData.get("notes") as string,
  };

  console.log("raw", rawData);

  const parsed = appointmentFormSchema.safeParse(rawData);

  console.log("parsed", parsed);

  if (!parsed.success) {
    console.error("parsing error in createAppointment:", parsed.error);
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

  const success = await loc.createAppointment(parsed.data);

  if (!success) {
    return {
      status: "error",
      fieldValues: parsed.data,
      formErrors: ["error creating appointment"],
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    fieldValues: rawData,
  };
}
