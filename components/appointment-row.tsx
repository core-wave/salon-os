import { CAppointment } from "@/lib/core/types/appointment";
import { SelectAppointment } from "@/lib/db/schema";
import { Avatar, Chip, Label, Separator } from "@heroui/react";
import { keyof } from "zod";

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
  appointmentTypeId,
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

      <Label className="font-normal">{appointmentTypeId}</Label>

      <Chip
        className="justify-self-start w-fit"
        // color={statusColorMap[status as typeof keyof statusColorMap]}
        variant="soft"
      >
        {status}
      </Chip>
    </>
  );
}
