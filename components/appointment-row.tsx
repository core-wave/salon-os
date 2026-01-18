import { SelectAppointment } from "@/lib/db/types";
import { getInitials } from "@/lib/utils";
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
  customer,
  startsAt,
  status,
}: SelectAppointment) {
  return (
    <>
      <Separator className="col-span-5" />

      <div className="flex items-center gap-3">
        <Avatar>
          <Avatar.Image
            alt={customer.id}
            src={`https://tapback.co/api/avatar/${customer.id}.webp`}
          />
          <Avatar.Fallback>{getInitials(customer.name)}</Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col">
          <Label>{customer.name}</Label>
          <Label className="font-normal text-sm text-muted">
            {customer.email}
          </Label>
        </div>
      </div>

      <Label className="font-normal">
        {startsAt.toLocaleDateString("en-NL", {
          day: "2-digit",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Label>

      <div className="flex flex-col">
        <Label className="font-normal">{appointmentType.name}</Label>
        <Label className="text-xs text-muted font-normal">
          {appointmentType.durationMinutes}min - {appointmentType.price}
          {appointmentType.currency}
        </Label>
      </div>

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
