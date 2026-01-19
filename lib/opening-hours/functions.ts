"use server";

import { revalidatePath } from "next/cache";
import { salonCore } from "../core";
import { FormState } from "../types";
import z from "zod";
import {
  OpeningHourExceptionFormProps,
  OpeningHoursFormProps,
  openingHourExceptionFormSchema,
  openingHoursFormSchema,
} from "./schema";

export async function updateOpeningHours(
  locationId: string,
  dayOfWeek: number,
  prevState: FormState<OpeningHoursFormProps>,
  formData: FormData
): Promise<FormState<OpeningHoursFormProps>> {
  const slotCount = Number(formData.get("slotCount") ?? 0);

  const rawData: OpeningHoursFormProps = {
    dayOfWeek,
    slots: Array.from({ length: slotCount }).map((_, idx) => ({
      opensAt: String(formData.get(`slots.${idx}.opensAt`)),
      closesAt: String(formData.get(`slots.${idx}.closesAt`)),
    })),
  };

  const parsed = openingHoursFormSchema(slotCount).safeParse(rawData);

  if (!parsed.success) {
    console.error("parsing error in updateOpeningHours:", parsed.error);
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const location = await salonCore.getLocation(locationId);
  if (!location) {
    console.log("location error");
    return { status: "error" };
  }

  const deleteSuccess = await location.deleteOpeningHours(dayOfWeek);
  if (!deleteSuccess) {
    console.log("delete error");
    return { status: "error" };
  }

  if (parsed.data?.slots.length > 0) {
    const createSuccess = await location.setOpeningHours(
      dayOfWeek,
      parsed.data.slots
    );
    if (!createSuccess) {
      console.log("create error");
      return { status: "error" };
    }
  }

  revalidatePath("/");

  return {
    status: "success",
    fieldValues: parsed.data,
  };
}

export async function upsertOpeningHourException(
  locationId: string,
  originalDate: string | null,
  prevState: FormState<OpeningHourExceptionFormProps>,
  formData: FormData
): Promise<FormState<OpeningHourExceptionFormProps>> {
  const slotCount = Number(formData.get("slotCount") ?? 0);

  const rawData: OpeningHourExceptionFormProps = {
    date: String(formData.get("date") ?? ""),
    remark: String(formData.get("remark") ?? "").trim() || undefined,
    slots: Array.from({ length: slotCount }).map((_, idx) => ({
      opensAt: String(formData.get(`slots.${idx}.opensAt`)),
      closesAt: String(formData.get(`slots.${idx}.closesAt`)),
    })),
  };

  const parsed = openingHourExceptionFormSchema(slotCount).safeParse(rawData);

  if (!parsed.success) {
    console.error("parsing error in upsertOpeningHourException:", parsed.error);
    return {
      status: "error",
      fieldErrors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const location = await salonCore.getLocation(locationId);
  if (!location) {
    console.log("location error");
    return { status: "error", fieldValues: parsed.data };
  }

  if (originalDate && originalDate !== parsed.data.date) {
    const deleteSuccess =
      await location.deleteOpeningHourException(originalDate);
    if (!deleteSuccess) {
      console.log("delete error");
      return { status: "error", fieldValues: parsed.data };
    }
  }

  const isClosed = parsed.data.slots.length === 0;

  const saveSuccess = await location.upsertOpeningHourException({
    date: parsed.data.date,
    isClosed,
    remark: parsed.data.remark ?? null,
    slots: parsed.data.slots,
  });

  if (!saveSuccess) {
    console.log("save error");
    return { status: "error", fieldValues: parsed.data };
  }

  revalidatePath("/");

  return {
    status: "success",
    fieldValues: parsed.data,
  };
}

export async function deleteOpeningHoursException(
  id: string,
  locationId: string,
  prevState: "default" | "error" | "success"
): Promise<"default" | "error" | "success"> {
  const loc = await salonCore.getLocation(locationId);
  if (!loc) {
    console.error("error getting location");
    return "error";
  }

  const success = await loc.deleteOpeningHourException(id);

  if (!success) {
    return "error";
  }

  revalidatePath("/");

  return "success";
}
