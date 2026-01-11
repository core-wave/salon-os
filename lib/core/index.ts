import { headers } from "next/headers";
import { auth } from "../auth";
import { db } from "../db";
import { locations, appointmentTypes, appointments } from "../db/schema";
import { and, eq } from "drizzle-orm";
import {
  InsertAppointment,
  InsertAppointmentType,
  InsertLocation,
  InsertOrganization,
  SelectAppointment,
  SelectAppointmentType,
  SelectLocation,
  SelectOrganization,
} from "../db/types";

class Core {
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

  //TODO: add update

  //TODO: add delete

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

  public async listAvailableOrganizations(): Promise<SelectOrganization[]> {
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

  public async getLocation(
    id: SelectLocation["id"]
  ): Promise<CLocation | null> {
    try {
      const [res] = await db
        .select()
        .from(locations)
        .where(
          and(eq(locations.organizationId, this.data.id), eq(locations.id, id))
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

  // Appointment Types

  public async createAppointmentType(
    data: InsertAppointmentType
  ): Promise<boolean> {
    try {
      const res = await db
        .insert(appointmentTypes)
        .values({ ...data, organizationId: this.data.id });

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
        .where(eq(appointmentTypes.organizationId, this.data.id));
    } catch (error) {
      console.error("error listing appointment types:", error);
      return [];
    }
  }
}

class CLocation {
  constructor(private readonly data: SelectLocation) {}

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
        })
        .from(appointments)
        .innerJoin(
          appointmentTypes,
          eq(appointments.appointmentTypeId, appointmentTypes.id)
        );
    } catch (error) {
      console.error("error listing appointments:", error);
      return [];
    }
  }
}

export const salonCore = new Core();
