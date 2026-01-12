"use server";

import { revalidatePath } from "next/cache";
import { salonCore } from "../core";
import { FormState } from "../types";
import { OpeningHoursFormProps, openingHoursFormSchema } from "./schema";

export async function updateOpeningHours(
  locationId: string,
  dayOfWeek: number,
  prevState: FormState<OpeningHoursFormProps>,
  formData: FormData
): Promise<FormState<OpeningHoursFormProps>> {
  const slotCount = Number(formData.get("slotCount") ?? 0);

  const slots = Array.from({ length: slotCount }).map((_, idx) => ({
    opensAt: String(formData.get(`slots.${idx}.opensAt`)),
    closesAt: String(formData.get(`slots.${idx}.closesAt`)),
  }));

  const parsed = openingHoursFormSchema(slotCount).safeParse({
    dayOfWeek,
    slots,
  });

  if (!parsed.success) {
    console.error("parsing error in updateOpeningHours:", parsed.error);
    return {
      status: "error",
    };
  }

  const location = await salonCore.getLocation(locationId);
  if (!location) {
    console.log("location not found");
    return { status: "error" };
  }

  if (prevState.fieldValues?.slots && prevState.fieldValues.slots.length > 0) {
    console.log(slots);
    const deleteSuccess = await location.deleteOpeningHours(dayOfWeek);
    if (!deleteSuccess) {
      console.log("delete error");
      return { status: "error" };
    }
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

  // validate here (no overlaps, opens < closes)

  //   await replaceOpeningHoursForDay(locationId, dayOfWeek, slots);

  revalidatePath("/");

  return { status: "success" };
}
