import { SelectAppointment } from "@/lib/db/types";
import { Avatar, Chip, Label, Separator } from "@heroui/react";

const statusColorMap: Record<
  SelectAppointment["status"],
  "success" | "warning" | "danger" | "default"
> = {
  Planned: "warning",
  Completed: "success",
  Cancelled: "danger",
  "No Show": "default",
};

export default async function AppointmentRow({
  appointmentType,
  customerId,
  startsAt,
  status,
}: SelectAppointment) {
  return (
    <>
      <Separator className="col-span-5" />

      <div className="flex items-center gap-3">
        <Avatar>
          <Avatar.Image
            alt={customerId}
            src={`https://tapback.co/api/avatar/${customerId}.webp`}
          />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col">
          <Label>{customerId}</Label>
          <Label className="font-normal text-sm text-muted">{customerId}</Label>
        </div>
      </div>

      <Label className="font-normal">{startsAt.toDateString()}</Label>

      <Label className="font-normal">{startsAt.toTimeString()}</Label>

      <Label className="font-normal">{appointmentType.name}</Label>

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
