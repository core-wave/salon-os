import { headers } from "next/headers";
import { auth } from "../auth";
import { db } from "../db";
import {
  locations,
  appointmentTypes,
  appointments,
  openingHours,
  openingHourSlots,
  openingHourExceptions,
  openingHourExceptionSlots,
  customers,
} from "../db/schema";
import { and, eq, asc, desc, inArray, gte, lt } from "drizzle-orm";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import {
  timeToMinutes,
  minutesToTime,
  addMinutesToTime,
  doTimesOverlap,
} from "../utils";
import { TimeSlot } from "../availability/types";
import {
  InsertAppointment,
  InsertAppointmentType,
  InsertCustomer,
  InsertLocation,
  InsertOpeningHour,
  InsertOpeningHourException,
  InsertOrganization,
  SelectAppointment,
  SelectAppointmentType,
  SelectCustomer,
  SelectLocation,
  SelectOpeningHour,
  SelectOpeningHourException,
  SelectOrganization,
} from "../db/types";

class Core {
  // Organizations

  public async getOrganizationBySlug(
    slug: SelectOrganization["slug"],
  ): Promise<COrganization | null> {
    try {
      const res = await auth.api.getFullOrganization({
        headers: await headers(),
        query: { organizationSlug: slug },
      });

      if (!res) return null;

      return new COrganization({
        id: res.id,
        createdAt: res.createdAt,
        name: res.name,
        slug: res.slug,
      });
    } catch (error) {
      console.error("error getting organization:", error);
      return null;
    }
  }

  public async listOrganizations(): Promise<SelectOrganization[]> {
    try {
      const res = await auth.api.listOrganizations({
        headers: await headers(),
      });

      return res.map((x) => ({
        id: x.id,
        createdAt: x.createdAt,
        name: x.name,
        slug: x.slug,
      }));
    } catch (error) {
      console.error("error listing organizations:", error);
      return [];
    }
  }

  public async createOrganization(
    { name, slug }: InsertOrganization,
    userId: string,
  ): Promise<COrganization | null> {
    try {
      const res = await auth.api.createOrganization({
        headers: await headers(),
        body: { name, slug, userId },
      });

      if (!res) return null;

      return new COrganization({
        id: res.id,
        createdAt: res.createdAt,
        name: res.name,
        slug: res.slug,
      });
    } catch (error) {
      console.error("error creating organization:", error);
      return null;
    }
  }

  public async getLocationBySlug(slug: string): Promise<CLocation | null> {
    try {
      const [res] = await db
        .select()
        .from(locations)
        .where(eq(locations.slug, slug))
        .limit(1);

      return new CLocation({
        id: res.id,
        createdAt: res.createdAt,
        name: res.name,
        slug: res.slug,
        isActive: res.isActive,
        phone: res.phone,
        formattedAddress: res.formattedAddress,
        placeId: res.placeId,
        googleMapsUri: res.googleMapsUri,
        streetName: res.streetName,
        streetNumber: res.streetNumber,
        postalCode: res.postalCode,
        city: res.city,
        administrativeArea: res.administrativeArea,
        countryCode: res.countryCode,
        lat: res.lat,
        lng: res.lng,
        timeZone: res.timeZone,
      });
    } catch (error) {
      console.error("error getting location:", error);
      return null;
    }
  }
}

class COrganization {
  constructor(readonly data: SelectOrganization) {}

  // Locations

  public async createLocation(data: InsertLocation): Promise<boolean> {
    try {
      const res = await db
        .insert(locations)
        .values({ ...data, organizationId: this.data.id });

      return res.count === 1;
    } catch (error) {
      console.error("error creating location:", error);
      return false;
    }
  }

  public async updateLocation(
    id: SelectLocation["id"],
    data: Partial<Omit<SelectLocation, "id" | "createdAt">>,
  ): Promise<boolean> {
    try {
      const res = await db
        .update(locations)
        .set(data)
        .where(
          and(eq(locations.id, id), eq(locations.organizationId, this.data.id)),
        );

      return res.count === 1;
    } catch (error) {
      console.error("error updating location:", error);
      return false;
    }
  }

  public async deleteLocation(id: SelectLocation["id"]): Promise<boolean> {
    try {
      const res = await db
        .delete(locations)
        .where(
          and(eq(locations.id, id), eq(locations.organizationId, this.data.id)),
        );

      return res.count > 0;
    } catch (error) {
      console.error("error deleting location:", error);
      return false;
    }
  }

  public async listLocations(): Promise<SelectLocation[]> {
    try {
      const res = await db
        .select()
        .from(locations)
        .where(eq(locations.organizationId, this.data.id));

      return res.map((x) => ({
        id: x.id,
        createdAt: x.createdAt,
        name: x.name,
        slug: x.slug,
        isActive: x.isActive,
        phone: x.phone,
        formattedAddress: x.formattedAddress,
        placeId: x.placeId,
        googleMapsUri: x.googleMapsUri,
        streetName: x.streetName,
        streetNumber: x.streetNumber,
        postalCode: x.postalCode,
        city: x.city,
        administrativeArea: x.administrativeArea,
        countryCode: x.countryCode,
        lat: x.lat,
        lng: x.lng,
        timeZone: x.timeZone,
      }));
    } catch (error) {
      console.error("error listing locations:", error);
      return [];
    }
  }

  // Customers

  public async createCustomer(data: InsertCustomer): Promise<boolean> {
    try {
      const res = await db
        .insert(customers)
        .values({ ...data, organizationId: this.data.id });

      return res.count === 1;
    } catch (error) {
      console.error("error creating customer:", error);
      return false;
    }
  }

  public async updateCustomer(
    id: SelectCustomer["id"],
    data: Partial<Omit<SelectCustomer, "id" | "createdAt">>,
  ): Promise<boolean> {
    try {
      const res = await db
        .update(customers)
        .set(data)
        .where(
          and(eq(customers.id, id), eq(customers.organizationId, this.data.id)),
        );

      return res.count > 0;
    } catch (error) {
      console.error("error updating customer:", error);
      return false;
    }
  }

  public async deleteCustomer(id: SelectCustomer["id"]): Promise<boolean> {
    try {
      const res = await db
        .delete(customers)
        .where(
          and(eq(customers.id, id), eq(customers.organizationId, this.data.id)),
        );

      return res.count > 0;
    } catch (error) {
      console.error("error deleting customer:", error);
      return false;
    }
  }

  public async listCustomers(): Promise<SelectCustomer[]> {
    try {
      return await db
        .select({
          id: customers.id,
          createdAt: customers.createdAt,
          userId: customers.userId,
          name: customers.name,
          email: customers.email,
          phone: customers.phone,
          notes: customers.notes,
        })
        .from(customers)
        .where(eq(customers.organizationId, this.data.id));
    } catch (error) {
      console.error("error listing customers:", error);
      return [];
    }
  }
}

class CLocation {
  constructor(readonly data: SelectLocation) {}

  // Appointment Types

  public async createAppointmentType(
    data: InsertAppointmentType,
  ): Promise<boolean> {
    try {
      const res = await db
        .insert(appointmentTypes)
        .values({ ...data, locationId: this.data.id });

      return res.count === 1;
    } catch (error) {
      console.error("error creating appointment type:", error);
      return false;
    }
  }

  public async updateAppointmentType(
    id: SelectAppointmentType["id"],
    data: Partial<Omit<SelectAppointmentType, "id" | "createdAt">>,
  ): Promise<boolean> {
    try {
      const res = await db
        .update(appointmentTypes)
        .set(data)
        .where(
          and(
            eq(appointmentTypes.id, id),
            eq(appointmentTypes.locationId, this.data.id),
          ),
        );

      return res.count > 0;
    } catch (error) {
      console.error("error updating appointment type:", error);
      return false;
    }
  }

  public async deleteAppointmentType(
    id: SelectAppointmentType["id"],
  ): Promise<boolean> {
    try {
      const res = await db
        .delete(appointmentTypes)
        .where(
          and(
            eq(appointmentTypes.id, id),
            eq(appointmentTypes.locationId, this.data.id),
          ),
        );

      return res.count > 0;
    } catch (error) {
      console.error("error deleting appointment type:", error);
      return false;
    }
  }

  public async listAppointmentTypes(): Promise<SelectAppointmentType[]> {
    try {
      return await db
        .select({
          id: appointmentTypes.id,
          createdAt: appointmentTypes.createdAt,
          name: appointmentTypes.name,
          description: appointmentTypes.description,
          durationMinutes: appointmentTypes.durationMinutes,
          price: appointmentTypes.price,
          currency: appointmentTypes.currency,
          isActive: appointmentTypes.isActive,
        })
        .from(appointmentTypes)
        .where(eq(appointmentTypes.locationId, this.data.id))
        .orderBy(desc(appointmentTypes.isActive), asc(appointmentTypes.name));
    } catch (error) {
      console.error("error listing appointment types:", error);
      return [];
    }
  }

  // Appointments

  public async createAppointment(data: InsertAppointment): Promise<boolean> {
    try {
      const res = await db
        .insert(appointments)
        .values({ ...data, locationId: this.data.id });

      return res.count === 1;
    } catch (error) {
      console.error("error creating appointment:", error);
      return false;
    }
  }

  public async updateAppointment(
    id: SelectAppointment["id"],
    data: Partial<Omit<SelectAppointment, "id">>,
  ): Promise<boolean> {
    try {
      const res = await db
        .update(appointments)
        .set(data)
        .where(
          and(
            eq(appointments.id, id),
            eq(appointments.locationId, this.data.id),
          ),
        );

      return res.count > 0;
    } catch (error) {
      console.error("error updating appointment:", error);
      return false;
    }
  }

  public async deleteAppointment(
    id: SelectAppointment["id"],
  ): Promise<boolean> {
    try {
      const res = await db
        .delete(appointments)
        .where(
          and(
            eq(appointments.id, id),
            eq(appointments.locationId, this.data.id),
          ),
        );

      return res.count > 0;
    } catch (error) {
      console.error("error deleting appointment:", error);
      return false;
    }
  }

  public async listAppointments(): Promise<SelectAppointment[]> {
    try {
      return await db
        .select({
          id: appointments.id,
          createdAt: appointments.createdAt,
          startsAt: appointments.startsAt,
          customerId: appointments.customerId,
          status: appointments.status,
          notes: appointments.notes,
          appointmentType: {
            id: appointmentTypes.id,
            createdAt: appointmentTypes.createdAt,
            name: appointmentTypes.name,
            description: appointmentTypes.description,
            durationMinutes: appointmentTypes.durationMinutes,
            price: appointmentTypes.price,
            currency: appointmentTypes.currency,
            isActive: appointmentTypes.isActive,
          },
          customer: {
            id: customers.id,
            createdAt: customers.createdAt,
            name: customers.name,
            email: customers.email,
            phone: customers.phone,
            userId: customers.userId,
            notes: customers.notes,
          },
        })
        .from(appointments)
        .innerJoin(
          appointmentTypes,
          eq(appointments.appointmentTypeId, appointmentTypes.id),
        )
        .innerJoin(customers, eq(appointments.customerId, customers.id))
        .where(eq(appointments.locationId, this.data.id));
    } catch (error) {
      console.error("error listing appointments:", error);
      return [];
    }
  }

  // Opening Hours

  public async listOpeningHours(): Promise<SelectOpeningHour[]> {
    try {
      const days = await db
        .select({
          id: openingHours.id,
          dayOfWeek: openingHours.dayOfWeek,
        })
        .from(openingHours)
        .where(eq(openingHours.locationId, this.data.id))
        .orderBy(asc(openingHours.dayOfWeek));

      if (days.length === 0) {
        return [];
      }

      const dayIds = days.map((day) => day.id);

      const slots = await db
        .select({
          id: openingHourSlots.id,
          openingHourId: openingHourSlots.openingHourId,
          opensAt: openingHourSlots.opensAt,
          closesAt: openingHourSlots.closesAt,
        })
        .from(openingHourSlots)
        .where(inArray(openingHourSlots.openingHourId, dayIds))
        .orderBy(asc(openingHourSlots.opensAt));

      return days.map((day) => ({
        ...day,
        slots: slots
          .filter((slot) => slot.openingHourId === day.id)
          .map(({ openingHourId: _openingHourId, ...slot }) => slot),
      }));
    } catch (error) {
      console.error("error listing opening hours:", error);
      return [];
    }
  }

  public async deleteOpeningHours(
    dayOfWeek: SelectOpeningHour["dayOfWeek"],
  ): Promise<boolean> {
    try {
      await db
        .delete(openingHours)
        .where(
          and(
            eq(openingHours.locationId, this.data.id),
            eq(openingHours.dayOfWeek, dayOfWeek),
          ),
        );

      return true;
    } catch (error) {
      console.error("error deleting opening hours:", error);
      return false;
    }
  }

  public async setOpeningHours({
    dayOfWeek,
    slots,
  }: InsertOpeningHour): Promise<boolean> {
    try {
      const [existing] = await db
        .select({ id: openingHours.id })
        .from(openingHours)
        .where(
          and(
            eq(openingHours.locationId, this.data.id),
            eq(openingHours.dayOfWeek, dayOfWeek),
          ),
        )
        .limit(1);

      let openingHourId = existing?.id;

      if (!openingHourId) {
        const [created] = await db
          .insert(openingHours)
          .values({
            locationId: this.data.id,
            dayOfWeek,
          })
          .returning({ id: openingHours.id });

        openingHourId = created?.id;
      }

      if (!openingHourId) {
        return false;
      }

      await db
        .delete(openingHourSlots)
        .where(eq(openingHourSlots.openingHourId, openingHourId));

      if (slots.length > 0) {
        await db.insert(openingHourSlots).values(
          slots.map((slot) => ({
            openingHourId,
            opensAt: slot.opensAt,
            closesAt: slot.closesAt,
          })),
        );
      }

      return true;
    } catch (error) {
      console.error("error creating opening hours:", error);
      return false;
    }
  }

  // Opening Hour Exceptions

  public async listOpeningHourExceptions(): Promise<
    SelectOpeningHourException[]
  > {
    try {
      const exceptions = await db
        .select({
          id: openingHourExceptions.id,
          date: openingHourExceptions.date,
          isClosed: openingHourExceptions.isClosed,
          remark: openingHourExceptions.remark,
        })
        .from(openingHourExceptions)
        .where(eq(openingHourExceptions.locationId, this.data.id))
        .orderBy(asc(openingHourExceptions.date));

      if (exceptions.length === 0) {
        return [];
      }

      const exceptionIds = exceptions.map((exception) => exception.id);

      const slots = await db
        .select({
          id: openingHourExceptionSlots.id,
          exceptionId: openingHourExceptionSlots.exceptionId,
          opensAt: openingHourExceptionSlots.opensAt,
          closesAt: openingHourExceptionSlots.closesAt,
        })
        .from(openingHourExceptionSlots)
        .where(inArray(openingHourExceptionSlots.exceptionId, exceptionIds))
        .orderBy(asc(openingHourExceptionSlots.opensAt));

      return exceptions.map((exception) => ({
        ...exception,
        slots: slots
          .filter((slot) => slot.exceptionId === exception.id)
          .map(({ exceptionId: _exceptionId, ...slot }) => slot),
      }));
    } catch (error) {
      console.error("error listing opening hour exceptions:", error);
      return [];
    }
  }

  public async upsertOpeningHourException({
    date,
    isClosed,
    remark,
    slots,
  }: InsertOpeningHourException): Promise<boolean> {
    try {
      const [existing] = await db
        .select({ id: openingHourExceptions.id })
        .from(openingHourExceptions)
        .where(
          and(
            eq(openingHourExceptions.locationId, this.data.id),
            eq(openingHourExceptions.date, date),
          ),
        )
        .limit(1);

      let exceptionId = existing?.id;

      if (!exceptionId) {
        const [created] = await db
          .insert(openingHourExceptions)
          .values({
            locationId: this.data.id,
            date: date,
            isClosed: isClosed,
            remark: remark ?? null,
          })
          .returning({ id: openingHourExceptions.id });

        exceptionId = created?.id;
      } else {
        await db
          .update(openingHourExceptions)
          .set({
            isClosed: isClosed,
            remark: remark ?? null,
          })
          .where(eq(openingHourExceptions.id, exceptionId));
      }

      if (!exceptionId) {
        return false;
      }

      await db
        .delete(openingHourExceptionSlots)
        .where(eq(openingHourExceptionSlots.exceptionId, exceptionId));

      if (!isClosed && slots.length > 0) {
        await db.insert(openingHourExceptionSlots).values(
          slots.map((slot) => ({
            exceptionId,
            opensAt: slot.opensAt,
            closesAt: slot.closesAt,
          })),
        );
      }

      return true;
    } catch (error) {
      console.error("error upserting opening hour exception:", error);
      return false;
    }
  }

  public async deleteOpeningHourException(
    id: SelectOpeningHourException["id"],
  ): Promise<boolean> {
    try {
      await db
        .delete(openingHourExceptions)
        .where(
          and(
            eq(openingHourExceptions.locationId, this.data.id),
            eq(openingHourExceptions.id, id),
          ),
        );

      return true;
    } catch (error) {
      console.error("error deleting opening hour exception:", error);
      return false;
    }
  }

  // Availability Calculation

  /**
   * Get opening time slots for a specific date
   * Checks exceptions first, then falls back to regular opening hours
   * @returns Array of { opensAt, closesAt } time strings, or null if closed/no hours
   */
  private async getOpeningSlotsForDate(
    dateString: string,
    dayOfWeek: number,
  ): Promise<{ opensAt: string; closesAt: string }[] | null> {
    try {
      // Check for exception first
      const exception = await db.query.openingHourExceptions.findFirst({
        where: and(
          eq(openingHourExceptions.locationId, this.data.id),
          eq(openingHourExceptions.date, dateString),
        ),
        with: {
          slots: {
            orderBy: [asc(openingHourExceptionSlots.opensAt)],
          },
        },
      });

      if (exception) {
        if (exception.isClosed) {
          return null; // Location closed on this date
        }
        return exception.slots.map((slot) => ({
          opensAt: slot.opensAt,
          closesAt: slot.closesAt,
        }));
      }

      // Fall back to regular opening hours
      const regularHours = await db.query.openingHours.findFirst({
        where: and(
          eq(openingHours.locationId, this.data.id),
          eq(openingHours.dayOfWeek, dayOfWeek),
        ),
        with: {
          slots: {
            orderBy: [asc(openingHourSlots.opensAt)],
          },
        },
      });

      if (!regularHours || regularHours.slots.length === 0) {
        return null; // No hours defined for this day
      }

      return regularHours.slots.map((slot) => ({
        opensAt: slot.opensAt,
        closesAt: slot.closesAt,
      }));
    } catch (error) {
      console.error("error getting opening slots for date:", error);
      return null;
    }
  }

  /**
   * Get existing appointments for a specific date with their calculated end times
   * Only includes "Planned" appointments
   */
  private async getAppointmentBlocksForDate(
    dateString: string,
  ): Promise<{ startsAt: string; endsAt: string }[]> {
    try {
      const timeZone = this.data.timeZone;

      // Parse the date string in the location's timezone
      const dateObj = new Date(dateString + "T00:00:00");
      const dayStart = zonedTimeToUtc(dateObj, timeZone);

      // Create next day for upper bound (exclusive)
      const nextDayObj = new Date(dateObj);
      nextDayObj.setDate(nextDayObj.getDate() + 1);
      const dayEnd = zonedTimeToUtc(nextDayObj, timeZone);

      const existingAppointments = await db
        .select({
          startsAt: appointments.startsAt,
          durationMinutes: appointmentTypes.durationMinutes,
        })
        .from(appointments)
        .innerJoin(
          appointmentTypes,
          eq(appointments.appointmentTypeId, appointmentTypes.id),
        )
        .where(
          and(
            eq(appointments.locationId, this.data.id),
            eq(appointments.status, "Planned"),
            gte(appointments.startsAt, dayStart),
            lt(appointments.startsAt, dayEnd),
          ),
        );

      // Convert to location timezone and calculate end times
      return existingAppointments.map((appt) => {
        const startInTz = utcToZonedTime(appt.startsAt, timeZone);
        const startTime = format(startInTz, "HH:mm:ss", { timeZone });
        const endTime = addMinutesToTime(startTime, appt.durationMinutes);
        return {
          startsAt: startTime,
          endsAt: endTime,
        };
      });
    } catch (error) {
      console.error("error getting appointment blocks for date:", error);
      return [];
    }
  }

  /**
   * Generate candidate time slots at 15-minute intervals
   * Only generates slots where the appointment can complete before closing
   */
  private generateCandidateSlots(
    dateString: string,
    openingSlots: { opensAt: string; closesAt: string }[],
    durationMinutes: number,
  ): { startsAt: string; endsAt: string }[] {
    const candidates: { startsAt: string; endsAt: string }[] = [];

    for (const period of openingSlots) {
      const startMinutes = timeToMinutes(period.opensAt);
      const endMinutes = timeToMinutes(period.closesAt);

      // Generate slots at 15-minute intervals
      for (
        let slotStart = startMinutes;
        slotStart < endMinutes;
        slotStart += 15
      ) {
        const slotEnd = slotStart + durationMinutes;

        // Only include if appointment can complete before closing
        if (slotEnd <= endMinutes) {
          candidates.push({
            startsAt: minutesToTime(slotStart),
            endsAt: minutesToTime(slotEnd),
          });
        }
      }
    }

    return candidates;
  }

  /**
   * Filter out time slots that conflict with existing appointments
   */
  private filterConflictingSlots(
    candidates: { startsAt: string; endsAt: string }[],
    appointments: { startsAt: string; endsAt: string }[],
  ): { startsAt: string; endsAt: string }[] {
    return candidates.filter((candidate) => {
      // Check if this slot overlaps with any existing appointment
      for (const appt of appointments) {
        if (
          doTimesOverlap(
            candidate.startsAt,
            candidate.endsAt,
            appt.startsAt,
            appt.endsAt,
          )
        ) {
          return false; // Conflict found, exclude this slot
        }
      }
      return true; // No conflicts
    });
  }

  /**
   * Get available time slots for booking an appointment on a specific date
   * @param dateString Date in YYYY-MM-DD format
   * @param appointmentTypeId ID of the appointment type to book
   * @returns Array of available time slots with ISO timestamps and display times
   */
  public async getAvailableSlots(
    dateString: string,
    appointmentTypeId: string,
  ): Promise<TimeSlot[]> {
    try {
      // Get appointment type to know the duration
      const apptType = await db.query.appointmentTypes.findFirst({
        where: and(
          eq(appointmentTypes.id, appointmentTypeId),
          eq(appointmentTypes.locationId, this.data.id),
        ),
      });

      if (!apptType) {
        console.error("appointment type not found");
        return [];
      }

      // Parse date and get day of week (0 = Sunday)
      const date = new Date(dateString + "T00:00:00");
      const dayOfWeek = date.getDay();

      // Step 1: Get opening hours for this date
      const openingSlots = await this.getOpeningSlotsForDate(
        dateString,
        dayOfWeek,
      );

      if (!openingSlots) {
        return []; // Location closed or no hours defined
      }

      // Step 2: Get existing appointments
      const existingAppointments =
        await this.getAppointmentBlocksForDate(dateString);

      // Step 3: Generate candidate slots
      const candidates = this.generateCandidateSlots(
        dateString,
        openingSlots,
        apptType.durationMinutes,
      );

      // Step 4: Filter out conflicting slots
      const availableSlots = this.filterConflictingSlots(
        candidates,
        existingAppointments,
      );

      // Step 5: Format and return
      const timeZone = this.data.timeZone;
      return availableSlots.map((slot) => {
        // Create ISO timestamp in location timezone
        const startDateTime = zonedTimeToUtc(
          new Date(`${dateString}T${slot.startsAt}`),
          timeZone,
        );
        const endDateTime = zonedTimeToUtc(
          new Date(`${dateString}T${slot.endsAt}`),
          timeZone,
        );

        return {
          startsAt: startDateTime.toISOString(),
          endsAt: endDateTime.toISOString(),
          display: {
            startTime: slot.startsAt.substring(0, 5), // "HH:MM"
            endTime: slot.endsAt.substring(0, 5), // "HH:MM"
          },
        };
      });
    } catch (error) {
      console.error("error getting available slots:", error);
      return [];
    }
  }
}

export const salonCore = new Core();
