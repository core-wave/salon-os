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
import { and, eq, asc, desc, inArray } from "drizzle-orm";
import {
  InsertAppointment,
  InsertAppointmentType,
  InsertLocation,
  InsertOrganization,
  SelectAppointment,
  SelectAppointmentType,
  SelectCustomer,
  SelectLocation,
  SelectOpeningHour,
  SelectOpeningHourException,
  SelectOpeningHourExceptionSlot,
  SelectOpeningHourSlot,
  SelectOrganization,
} from "../db/types";

class Core {
  public async getOrganizationBySlug(
    slug: SelectOrganization["slug"]
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

  // Organizations

  public async createOrganization(
    { name, slug }: InsertOrganization,
    userId: string
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

  // Locations

  public async getLocation(id: string): Promise<CLocation | null> {
    try {
      const [res] = await db
        .select()
        .from(locations)
        .where(eq(locations.id, id))
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

  public async createLocation(data: InsertLocation): Promise<boolean> {
    try {
      const res = await db.insert(locations).values(data);

      return res.count === 1;
    } catch (error) {
      console.error("error creating location:", error);
      return false;
    }
  }

  public async updateLocation(
    id: SelectLocation["id"],
    data: Partial<Omit<SelectLocation, "id" | "createdAt">>
  ): Promise<boolean> {
    try {
      const res = await db
        .update(locations)
        .set(data)
        .where(eq(locations.id, id));

      return res.count === 1;
    } catch (error) {
      console.error("error updating location:", error);
      return false;
    }
  }

  public async deleteLocation(id: SelectLocation["id"]): Promise<boolean> {
    try {
      const res = await db.delete(locations).where(eq(locations.id, id));

      return res.count > 0;
    } catch (error) {
      console.error("error deleting location:", error);
      return false;
    }
  }

  // Appointment Types

  public async createAppointmentType(
    data: InsertAppointmentType
  ): Promise<boolean> {
    try {
      const res = await db.insert(appointmentTypes).values(data);

      return res.count === 1;
    } catch (error) {
      console.error("error creating appointment type:", error);
      return false;
    }
  }

  public async updateAppointmentType(
    id: SelectAppointmentType["id"],
    data: Partial<Omit<SelectAppointmentType, "id">>
  ): Promise<boolean> {
    try {
      const res = await db
        .update(appointmentTypes)
        .set(data)
        .where(eq(appointmentTypes.id, id));

      return res.count > 0;
    } catch (error) {
      console.error("error updating appointment type:", error);
      return false;
    }
  }

  public async deleteAppointmentType(
    id: SelectAppointmentType["id"]
  ): Promise<boolean> {
    try {
      const res = await db
        .delete(appointmentTypes)
        .where(eq(appointmentTypes.id, id));

      return res.count > 0;
    } catch (error) {
      console.error("error deleting appointment type:", error);
      return false;
    }
  }

  // Appointments

  public async createAppointment(data: InsertAppointment): Promise<boolean> {
    try {
      const res = await db.insert(appointments).values(data);

      return res.count === 1;
    } catch (error) {
      console.error("error creating appointment:", error);
      return false;
    }
  }

  public async updateAppointment(
    id: SelectAppointment["id"],
    data: Partial<Omit<SelectAppointment, "id">>
  ): Promise<boolean> {
    try {
      const res = await db
        .update(appointments)
        .set(data)
        .where(eq(appointments.id, id));

      return res.count > 0;
    } catch (error) {
      console.error("error updating appointment:", error);
      return false;
    }
  }

  public async deleteAppointment(
    id: SelectAppointment["id"]
  ): Promise<boolean> {
    try {
      const res = await db.delete(appointments).where(eq(appointments.id, id));

      return res.count > 0;
    } catch (error) {
      console.error("error deleting appointment:", error);
      return false;
    }
  }
}

class COrganization {
  constructor(readonly data: SelectOrganization) {}

  public async getLocationBySlug(
    slug: SelectLocation["slug"]
  ): Promise<CLocation | null> {
    try {
      const [res] = await db
        .select()
        .from(locations)
        .where(
          and(
            eq(locations.organizationId, this.data.id),
            eq(locations.slug, slug)
          )
        )
        .limit(1);

      if (!res) return null;

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

  public async listRegularOpeningHours(): Promise<
    (SelectOpeningHour & { slots: SelectOpeningHourSlot[] })[]
  > {
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

  public async deleteOpeningHours(dayOfWeek: number): Promise<boolean> {
    try {
      await db
        .delete(openingHours)
        .where(
          and(
            eq(openingHours.locationId, this.data.id),
            eq(openingHours.dayOfWeek, dayOfWeek)
          )
        );

      return true;
    } catch (error) {
      console.error("error deleting opening hours:", error);
      return false;
    }
  }

  public async setOpeningHours(
    dayOfWeek: number,
    slots: { opensAt: string; closesAt: string }[]
  ): Promise<boolean> {
    try {
      const [existing] = await db
        .select({ id: openingHours.id })
        .from(openingHours)
        .where(
          and(
            eq(openingHours.locationId, this.data.id),
            eq(openingHours.dayOfWeek, dayOfWeek)
          )
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
          }))
        );
      }

      return true;
    } catch (error) {
      console.error("error creating opening hours:", error);
      return false;
    }
  }

  public async listOpeningHourExceptions(): Promise<
    (SelectOpeningHourException & {
      slots: SelectOpeningHourExceptionSlot[];
    })[]
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

  public async upsertOpeningHourException(input: {
    date: string;
    isClosed: boolean;
    remark?: string | null;
    slots: { opensAt: string; closesAt: string }[];
  }): Promise<boolean> {
    try {
      const [existing] = await db
        .select({ id: openingHourExceptions.id })
        .from(openingHourExceptions)
        .where(
          and(
            eq(openingHourExceptions.locationId, this.data.id),
            eq(openingHourExceptions.date, input.date)
          )
        )
        .limit(1);

      let exceptionId = existing?.id;

      if (!exceptionId) {
        const [created] = await db
          .insert(openingHourExceptions)
          .values({
            locationId: this.data.id,
            date: input.date,
            isClosed: input.isClosed,
            remark: input.remark ?? null,
          })
          .returning({ id: openingHourExceptions.id });

        exceptionId = created?.id;
      } else {
        await db
          .update(openingHourExceptions)
          .set({
            isClosed: input.isClosed,
            remark: input.remark ?? null,
          })
          .where(eq(openingHourExceptions.id, exceptionId));
      }

      if (!exceptionId) {
        return false;
      }

      await db
        .delete(openingHourExceptionSlots)
        .where(eq(openingHourExceptionSlots.exceptionId, exceptionId));

      if (!input.isClosed && input.slots.length > 0) {
        await db.insert(openingHourExceptionSlots).values(
          input.slots.map((slot) => ({
            exceptionId,
            opensAt: slot.opensAt,
            closesAt: slot.closesAt,
          }))
        );
      }

      return true;
    } catch (error) {
      console.error("error upserting opening hour exception:", error);
      return false;
    }
  }

  public async deleteOpeningHourException(date: string): Promise<boolean> {
    try {
      await db
        .delete(openingHourExceptions)
        .where(
          and(
            eq(openingHourExceptions.locationId, this.data.id),
            eq(openingHourExceptions.date, date)
          )
        );

      return true;
    } catch (error) {
      console.error("error deleting opening hour exception:", error);
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
          eq(appointments.appointmentTypeId, appointmentTypes.id)
        )
        .innerJoin(customers, eq(appointments.customerId, customers.id))
        .where(eq(appointments.locationId, this.data.id));
    } catch (error) {
      console.error("error listing appointments:", error);
      return [];
    }
  }
}

export const salonCore = new Core();
