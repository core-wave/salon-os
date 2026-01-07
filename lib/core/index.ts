import { CAppointmentType } from "./types/appointment_type";

class Core {
    public async GetLocationBySlug(slug: string) {
        return new Location();
    }
}

class Location {
    public async GetAllAppointmentTypes(): Promise<CAppointmentType[]> {
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

export const SalonCore = new Core();