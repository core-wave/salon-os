"use server";

import { salonCore } from "../core";
import { TimeSlot } from "./types";

/**
 * Get available time slots for booking an appointment
 * @param locationSlug Location slug to get slots for
 * @param dateString Date in YYYY-MM-DD format
 * @param appointmentTypeId ID of the appointment type
 * @returns Array of available time slots
 */
export async function getAvailableSlots(
  locationSlug: string,
  dateString: string,
  appointmentTypeId: string,
): Promise<TimeSlot[]> {
  console.log("[getAvailableSlots] called with:", {
    locationSlug,
    dateString,
    appointmentTypeId,
  });

  try {
    const location = await salonCore.getLocationBySlug(locationSlug);

    if (!location) {
      console.error("[getAvailableSlots] location not found:", locationSlug);
      return [];
    }

    console.log("[getAvailableSlots] location found:", location.data.name);

    const slots = await location.getAvailableSlots(dateString, appointmentTypeId);

    console.log("[getAvailableSlots] returning", slots.length, "slots");

    return slots;
  } catch (error) {
    console.error("[getAvailableSlots] error:", error);
    return [];
  }
}
