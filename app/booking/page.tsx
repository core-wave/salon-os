import { Button, Chip, Description, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

type AppointmentType = {
  title: string;
  price: number; // in euros
  description: string;
  duration: number; // in minutes
};

type Employee = {
  name: string;
  title: string;
  imageSrc: string;
};

type TimeSlot = {
  start: string; // ISO datetime
  end: string; // ISO datetime
};

type Availability = {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
};

export const appointmentTypes: AppointmentType[] = [
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

export default async function BookingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* top bar */}
      <div className="w-full flex bg-surface p-4 justify-between items-center">
        <Button variant="ghost" isIconOnly>
          <Icon icon={"hugeicons:arrow-left-01"} />
        </Button>
        <p className="font-medium text-muted">Select Service</p>
        <Button variant="ghost" isIconOnly>
          <Icon icon={"hugeicons:cancel-01"} />
        </Button>
      </div>

      {/* slider */}
      <div className="w-full">
        <div className="w-1/2 h-0.5 bg-accent"></div>
      </div>

      {/* services */}
      <div className="w-full flex flex-col gap-4 p-4">
        {appointmentTypes.map((type, idx) => (
          <Link
            key={idx}
            href="/details"
            className="rounded-xl hover:ring-2 ring-accent-soft bg-surface shadow-sm"
          >
            <div className="flex p-4 gap-4">
              <Image
                alt="image"
                src={`https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=3280&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                width={88}
                height={88}
                className="rounded-xl"
              />
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                  <Label>{type.title}</Label>
                  <Description className="line-clamp-2">
                    {type.description}
                  </Description>
                </div>
                <div className="flex flex-row gap-2">
                  <Chip>
                    <Icon icon={`hugeicons:clock-01`} />
                    {type.duration} min
                  </Chip>
                  <Chip>
                    <Icon icon={`hugeicons:euro`} /> {type.price}
                  </Chip>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
