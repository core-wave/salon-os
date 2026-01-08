import { headers } from "next/headers";
import { auth } from "../auth";
import { db } from "../db";
import { organization } from "../db/auth";
import { CAppointment } from "./types/appointment";
import { CAppointmentType } from "./types/appointment_type";
import { InsertLocation, locations } from "../db/schema";

class Core {
  public async createOrganization(slug: string, name: string, userId: string) {
    try {
      const res = await auth.api.createOrganization({
        headers: await headers(),
        body: { name, slug, userId },
      });

      if (!res) return null;

      return { slug: res.slug };
    } catch (error) {
      return null;
    }
  }

  public async getLocationBySlug(slug: string): Promise<CLocation> {
    return new CLocation();
  }

  public async getOrganizationBySlug(
    slug: string
  ): Promise<COrganization | null> {
    try {
      const res = await auth.api.getFullOrganization({
        headers: await headers(),
        query: { organizationSlug: slug },
      });

      if (!res) return null;

      return new COrganization(res.id, res.name, res.slug);
    } catch (error) {
      return null;
    }
  }

  public async listAvailableOrganizations(): Promise<COrganization[]> {
    try {
      const res = await auth.api.listOrganizations({
        headers: await headers(),
      });

      return res.map((x) => new COrganization(x.id, x.name, x.slug));
    } catch (error) {
      return [];
    }
  }
}

class COrganization {
  readonly id: string;
  readonly name: string;
  readonly slug: string;

  constructor(id: string, name: string, slug: string) {
    this.id = id;
    this.name = name;
    this.slug = slug;
  }

  public async createLocation(data: InsertLocation) {
    try {
      const res = await db
        .insert(locations)
        .values(data)
        .returning({ id: locations.id, slug: locations.slug });

      return res;
    } catch (error) {
      return null;
    }
  }

  public async listAppointmentTypes(): Promise<CAppointmentType[]> {
    return [
      {
        title: "Initial Consultation",
        description:
          "A short intake session to discuss your goals, assess your needs, and determine the best treatment plan.",
        duration: 25,
        price: 30.0,
      },
      {
        title: "Follow-up Appointment",
        description:
          "A focused follow-up to evaluate progress, adjust the approach, and answer any remaining questions.",
        duration: 20,
        price: 25.0,
      },
      {
        title: "Extended Treatment Session",
        description:
          "A longer, in-depth session designed for more complex treatments or multiple focus areas.",
        duration: 50,
        price: 55.0,
      },
      {
        title: "Express Check-up",
        description:
          "A quick check-up for minor concerns or brief evaluations that don’t require a full session.",
        duration: 15,
        price: 20.0,
      },
      {
        title: "Premium Consultation",
        description:
          "A comprehensive session with extended time, personalized advice, and detailed aftercare guidance.",
        duration: 60,
        price: 75.0,
      },
    ];
  }
}

class CLocation {
  public async listAppointments(): Promise<CAppointment[]> {
    return [
      {
        customer: {
          fullName: "Liam Johnson",
          email: "liam.johnson@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "09:00",
        duration: 30,
        appointmentType: "Men’s Haircut",
        status: "Completed",
      },
      {
        customer: {
          fullName: "Noah Williams",
          email: "noah.williams@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "09:30",
        duration: 45,
        appointmentType: "Skin Fade",
        status: "Completed",
      },
      {
        customer: {
          fullName: "Emma Brown",
          email: "emma.brown@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "10:00",
        duration: 45,
        appointmentType: "Wash & Cut",
        status: "Completed",
      },
      {
        customer: {
          fullName: "Olivia Jones",
          email: "olivia.jones@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "10:30",
        duration: 30,
        appointmentType: "Blow Dry",
        status: "Cancelled",
      },
      {
        customer: {
          fullName: "James Garcia",
          email: "james.garcia@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "11:00",
        duration: 15,
        appointmentType: "Beard Trim",
        status: "Completed",
      },
      {
        customer: {
          fullName: "Benjamin Miller",
          email: "benjamin.miller@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "11:30",
        duration: 30,
        appointmentType: "Men’s Haircut",
        status: "Completed",
      },
      {
        customer: {
          fullName: "Sophia Davis",
          email: "sophia.davis@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "12:00",
        duration: 60,
        appointmentType: "Cut & Style",
        status: "No Show",
      },
      {
        customer: {
          fullName: "Lucas Martinez",
          email: "lucas.martinez@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "12:30",
        duration: 45,
        appointmentType: "Skin Fade",
        status: "Completed",
      },
      {
        customer: {
          fullName: "Mason Rodriguez",
          email: "mason.rodriguez@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "13:00",
        duration: 30,
        appointmentType: "Men’s Haircut",
        status: "Completed",
      },
      {
        customer: {
          fullName: "Isabella Hernandez",
          email: "isabella.hernandez@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "13:30",
        duration: 45,
        appointmentType: "Wash & Cut",
        status: "Completed",
      },
      {
        customer: {
          fullName: "Ethan Lopez",
          email: "ethan.lopez@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "14:00",
        duration: 15,
        appointmentType: "Beard Trim",
        status: "Completed",
      },
      {
        customer: {
          fullName: "Ava Gonzalez",
          email: "ava.gonzalez@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "14:30",
        duration: 60,
        appointmentType: "Cut & Style",
        status: "Planned",
      },
      {
        customer: {
          fullName: "Alexander Wilson",
          email: "alexander.wilson@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "15:00",
        duration: 30,
        appointmentType: "Men’s Haircut",
        status: "Planned",
      },
      {
        customer: {
          fullName: "Mia Anderson",
          email: "mia.anderson@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "15:30",
        duration: 30,
        appointmentType: "Blow Dry",
        status: "Planned",
      },
      {
        customer: {
          fullName: "Daniel Thomas",
          email: "daniel.thomas@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "16:00",
        duration: 45,
        appointmentType: "Skin Fade",
        status: "Planned",
      },
      {
        customer: {
          fullName: "Charlotte Taylor",
          email: "charlotte.taylor@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "16:30",
        duration: 45,
        appointmentType: "Wash & Cut",
        status: "Planned",
      },
      {
        customer: {
          fullName: "Henry Moore",
          email: "henry.moore@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "17:00",
        duration: 30,
        appointmentType: "Men’s Haircut",
        status: "Planned",
      },
      {
        customer: {
          fullName: "Amelia Jackson",
          email: "amelia.jackson@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "17:30",
        duration: 60,
        appointmentType: "Cut & Style",
        status: "Planned",
      },
      {
        customer: {
          fullName: "Sebastian Martin",
          email: "sebastian.martin@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "18:00",
        duration: 15,
        appointmentType: "Beard Trim",
        status: "Planned",
      },
      {
        customer: {
          fullName: "Harper Lee",
          email: "harper.lee@example.com",
          imageSrc: "https://avatar.iran.liara.run/public",
        },
        date: "2026-01-06",
        time: "18:30",
        duration: 30,
        appointmentType: "Men’s Haircut",
        status: "Planned",
      },
    ];
  }
}

export const salonCore = new Core();
