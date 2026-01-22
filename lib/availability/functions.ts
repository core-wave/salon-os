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
  try {
    const location = await salonCore.getLocationBySlug(locationSlug);

    if (!location) {
      console.error("location not found:", locationSlug);
      return [];
    }

    return await location.getAvailableSlots(dateString, appointmentTypeId);
  } catch (error) {
    console.error("error getting available slots:", error);
    return [];
  }
}
