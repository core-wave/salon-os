import { Avatar, Button, Card, Chip, Label, Separator } from "@heroui/react";
import { Fragment } from "react/jsx-runtime";
import { Icon } from "@iconify/react";

const statusColorMap: Record<
  Appointment["status"],
  "success" | "warning" | "danger" | "default"
> = {
  Planned: "warning",
  Completed: "success",
  Cancelled: "danger",
  "No Show": "default",
};

type Appointment = {
  customer: {
    fullName: string;
    imageSrc: string;
  };
  date: string;
  time: string;
  appointmentType: string;
  status: "Planned" | "Completed" | "Cancelled" | "No Show";
};

const mockAppointments: Appointment[] = [
  {
    customer: {
      fullName: "Liam Johnson",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "09:00",
    appointmentType: "Men’s Haircut",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Noah Williams",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "09:30",
    appointmentType: "Skin Fade",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Emma Brown",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "10:00",
    appointmentType: "Wash & Cut",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Olivia Jones",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "10:30",
    appointmentType: "Blow Dry",
    status: "Cancelled",
  },
  {
    customer: {
      fullName: "James Garcia",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "11:00",
    appointmentType: "Beard Trim",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Benjamin Miller",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "11:30",
    appointmentType: "Men’s Haircut",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Sophia Davis",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "12:00",
    appointmentType: "Cut & Style",
    status: "No Show",
  },
  {
    customer: {
      fullName: "Lucas Martinez",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "12:30",
    appointmentType: "Skin Fade",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Mason Rodriguez",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "13:00",
    appointmentType: "Men’s Haircut",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Isabella Hernandez",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "13:30",
    appointmentType: "Wash & Cut",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Ethan Lopez",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "14:00",
    appointmentType: "Beard Trim",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Ava Gonzalez",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "14:30",
    appointmentType: "Cut & Style",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Alexander Wilson",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "15:00",
    appointmentType: "Men’s Haircut",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Mia Anderson",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "15:30",
    appointmentType: "Blow Dry",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Daniel Thomas",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "16:00",
    appointmentType: "Skin Fade",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Charlotte Taylor",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "16:30",
    appointmentType: "Wash & Cut",
    status: "No Show",
  },
  {
    customer: {
      fullName: "Henry Moore",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "17:00",
    appointmentType: "Men’s Haircut",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Amelia Jackson",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "17:30",
    appointmentType: "Cut & Style",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Sebastian Martin",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "18:00",
    appointmentType: "Beard Trim",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Harper Lee",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "18:30",
    appointmentType: "Men’s Haircut",
    status: "Planned",
  },
];

export default function AppointmentsPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1>Appointments</h1>
        <Button>
          <Icon icon={`hugeicons:add-01`} />
          Add Appointment
        </Button>
      </div>

      <Card className="gap-6">
        <div className="grid grid-cols-[auto_auto_auto_auto_auto] gap-y-3 gap-x-4 items-center">
          <Label className="font-semibold">Customer</Label>
          <Label className="font-semibold">Date</Label>
          <Label className="font-semibold">Time</Label>
          <Label className="font-semibold">Appointment Type</Label>
          <Label className="font-semibold">Status</Label>
          {mockAppointments.map((appt, idx) => (
            <Fragment key={idx}>
              <Separator className="col-span-5" />

              <div className="flex items-center gap-2">
                <Avatar>
                  <Avatar.Image
                    alt={appt.customer.fullName}
                    src={appt.customer.imageSrc}
                  />
                  <Avatar.Fallback>JD</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <Label>{appt.customer.fullName}</Label>
                  <Label className="font-normal text-sm text-muted">
                    email address here
                  </Label>
                </div>
              </div>

              <Label className="font-normal">{appt.date}</Label>

              <Label className="font-normal">{appt.time}</Label>

              <Label className="font-normal">{appt.appointmentType}</Label>

              <Chip
                className="justify-self-start w-fit"
                color={statusColorMap[appt.status]}
                variant="soft"
              >
                {appt.status}
              </Chip>
            </Fragment>
          ))}
        </div>
      </Card>
    </>
  );
}
