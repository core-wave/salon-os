"use server";

import { db } from "../db";
import { appointments, customers } from "../db/schema";
import { salonCore } from "../core";
import { publicBookingSchema } from "./schemas";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type BookingFormState =
  | { status: "default" }
  | { status: "success"; appointmentId: string }
  | {
      status: "error";
      message?: string;
      fieldErrors?: Record<string, { errors: string[] }>;
    };

export async function createPublicBooking(
  orgSlug: string,
  locationSlug: string,
  prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const rawData = {
    appointmentTypeId: formData.get("appointmentTypeId"),
    startsAt: formData.get("startsAt"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    notes: formData.get("notes"),
  };

  const parsed = publicBookingSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Record<string, { errors: string[] }> = {};
    for (const [key, value] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      fieldErrors[key] = { errors: value ?? [] };
    }
    return { status: "error", fieldErrors };
  }

  const { appointmentTypeId, startsAt, customerName, customerEmail, customerPhone, notes } =
    parsed.data;

  try {
    const location = await salonCore.getPublicLocation(orgSlug, locationSlug);

    if (!location) {
      return { status: "error", message: "Location not found" };
    }

    const organizationId = location.data.organizationId;

    // Find or create customer by email within the organization
    let [customer] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(
        and(
          eq(customers.organizationId, organizationId),
          eq(customers.email, customerEmail),
        ),
      )
      .limit(1);

    if (!customer) {
      const [newCustomer] = await db
        .insert(customers)
        .values({
          organizationId,
          name: customerName,
          email: customerEmail,
          phone: customerPhone || null,
        })
        .returning({ id: customers.id });

      customer = newCustomer;
    } else {
      // Update customer name if they exist (in case they changed their name)
      await db
        .update(customers)
        .set({
          name: customerName,
          phone: customerPhone || null,
        })
        .where(eq(customers.id, customer.id));
    }

    // Create the appointment
    const [appointment] = await db
      .insert(appointments)
      .values({
        locationId: location.data.id,
        customerId: customer.id,
        appointmentTypeId,
        startsAt: new Date(startsAt),
        notes: notes || null,
      })
      .returning({ id: appointments.id });

    revalidatePath(`/b/${orgSlug}/${locationSlug}`);

    return { status: "success", appointmentId: appointment.id };
  } catch (error) {
    console.error("Error creating public booking:", error);
    return { status: "error", message: "Failed to create booking" };
  }
}
