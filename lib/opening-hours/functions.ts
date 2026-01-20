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
  locationSlug: string,
  dayOfWeek: number,
  prevState: FormState<OpeningHoursFormProps>,
  formData: FormData,
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

  const loc = await salonCore.getLocationBySlug(locationSlug);
  if (!loc)
    return {
      status: "error",
      fieldValues: parsed.data,
    };

  const deleteSuccess = await loc.deleteOpeningHours(dayOfWeek);
  if (!deleteSuccess) {
    console.log("delete error");
    return { status: "error" };
  }

  if (parsed.data?.slots.length > 0) {
    const createSuccess = await loc.setOpeningHours({
      dayOfWeek,
      slots: parsed.data.slots,
    });
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
  locationSlug: string,
  originalDate: string | null,
  prevState: FormState<OpeningHourExceptionFormProps>,
  formData: FormData,
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

  const loc = await salonCore.getLocationBySlug(locationSlug);
  if (!loc)
    return {
      status: "error",
      fieldValues: parsed.data,
    };

  if (originalDate && originalDate !== parsed.data.date) {
    const deleteSuccess = await loc.deleteOpeningHourException(originalDate);
    if (!deleteSuccess) {
      console.log("delete error");
      return { status: "error", fieldValues: parsed.data };
    }
  }

  const isClosed = parsed.data.slots.length === 0;

  const saveSuccess = await loc.upsertOpeningHourException({
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
  locationSlug: string,
  id: string,
  prevState: "default" | "error" | "success",
): Promise<"default" | "error" | "success"> {
  const loc = await salonCore.getLocationBySlug(locationSlug);
  if (!loc) return "error";

  const success = await loc.deleteOpeningHourException(id);

  if (!success) {
    return "error";
  }

  revalidatePath("/");

  return "success";
}
