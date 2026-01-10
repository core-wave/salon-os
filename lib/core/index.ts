import { headers } from "next/headers";
import { auth } from "../auth";
import { db } from "../db";
import {
  SelectLocation,
  InsertLocation,
  locations,
  InsertAppointmentType,
  SelectAppointmentType,
  appointmentTypes,
  SelectOrganization,
  InsertOrganization,
  InsertAppointment,
  appointments,
  SelectAppointment,
} from "../db/schema";
import { eq } from "drizzle-orm";

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

      return new COrganization(res);
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

      return new COrganization(res);
    } catch (error) {
      console.error("error getting organization:", error);
      return null;
    }
  }

  public async listAvailableOrganizations(): Promise<COrganization[]> {
    try {
      const res = await auth.api.listOrganizations({
        headers: await headers(),
      });

      return res.map((x) => new COrganization(x));
    } catch (error) {
      console.error("error listing organizations:", error);
      return [];
    }
  }
}

class COrganization {
  constructor(readonly data: Omit<SelectOrganization, "metadata" | "logo">) {}

  // Locations

  public async createLocation(data: InsertLocation): Promise<CLocation | null> {
    try {
      const [row] = await db.insert(locations).values(data).returning();

      return row ? new CLocation(row) : null;
    } catch (error) {
      console.error("error creating location:", error);
      return null;
    }
  }

  public async updateLocation(
    id: SelectLocation["id"],
    data: Partial<Omit<SelectLocation, "id">>
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

  public async listLocations(): Promise<CLocation[]> {
    try {
      const res = await db
        .select()
        .from(locations)
        .where(eq(locations.organizationId, this.data.id));

      return res.map((loc) => new CLocation(loc));
    } catch (error) {
      console.error("error listing locations:", error);
      return [];
    }
  }

  // Appointment Types

  public async createAppointmentType(data: InsertAppointmentType) {
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
  ) {
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

  public async deleteAppointmentType(id: SelectAppointmentType["id"]) {
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

  public async listAppointmentTypes() {
    try {
      const res = await db
        .select()
        .from(appointmentTypes)
        .where(eq(appointmentTypes.organizationId, this.data.id));

      return res;
    } catch (error) {
      console.error("error listing appointment types:", error);
      return [];
    }
  }
}

class CLocation {
  constructor(private readonly data: SelectLocation) {}

  // Appointments

  public async createAppointment(data: InsertAppointment) {
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
  ) {
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

  public async deleteAppointment(id: SelectAppointment["id"]) {
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
