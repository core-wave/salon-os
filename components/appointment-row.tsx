import { CAppointment } from "@/lib/core/types/appointment";
import { Avatar, Chip, Label, Separator } from "@heroui/react";

const statusColorMap: Record<
  CAppointment["status"],
  "success" | "warning" | "danger" | "default"
> = {
  Planned: "warning",
  Completed: "success",
  Cancelled: "danger",
  "No Show": "default",
};

export default async function AppointmentRow({
  appointmentType,
  customer,
  date,
  duration,
  status,
  time,
}: CAppointment) {
  return (
    <>
      <Separator className="col-span-5" />

      <div className="flex items-center gap-3">
        <Avatar>
          <Avatar.Image
            alt={customer.fullName}
            src={`https://tapback.co/api/avatar/${customer.fullName}.webp`}
          />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col">
          <Label>{customer.fullName}</Label>
          <Label className="font-normal text-sm text-muted">
            {customer.email}
          </Label>
        </div>
      </div>

      <Label className="font-normal">{date}</Label>

      <Label className="font-normal">{time}</Label>

      <Label className="font-normal">{appointmentType}</Label>

      <Chip
        className="justify-self-start w-fit"
        color={statusColorMap[status]}
        variant="soft"
      >
        {status}
      </Chip>
    </>
  );
}
