import { Appointment } from "@/lib/mockdata/appointments";
import { Chip, cn, Label, Surface } from "@heroui/react";
import { Icon } from "@iconify/react";
import CustomerCard from "./customer";

interface AppointmentCardProps {
  appointment: Appointment;
  hideDate?: boolean;
  variant?: "default" | "secondary" | "tertiary";
}

const statusColorMap: Record<
  Appointment["status"],
  {
    color: "success" | "warning" | "danger" | "default";
    icon: string;
  }
> = {
  Planned: { color: "warning", icon: "tabler:clock" },
  Completed: { color: "success", icon: "tabler:check" },
  Cancelled: { color: "danger", icon: "tabler:x" },
  "No Show": { color: "default", icon: "tabler:alert-triangle" },
};

export default function AppointmentCard({
  appointment,
  hideDate = false,
  variant = "default",
}: AppointmentCardProps) {
  return (
    <Surface
      variant={variant}
      className={cn("p-4 rounded-3xl flex flex-col gap-3")}
    >
      <div className="flex gap-2">
        <Label className="line-clamp-1">{appointment.appointmentType}</Label>
        <Label className="font-normal text-sm text-muted flex items-center gap-1">
          <Icon icon={`tabler:clock`} />
          {appointment.duration} min
        </Label>
      </div>

      <CustomerCard {...appointment.customer} />

      <div className="flex gap-2 justify-between">
        <Chip color="accent" variant="soft" className="shrink-0">
          {!hideDate && `${appointment.date} at`} {appointment.time}
        </Chip>
        <Chip color={statusColorMap[appointment.status].color} variant="soft">
          <Icon icon={statusColorMap[appointment.status].icon} />
          {appointment.status}
        </Chip>
      </div>
    </Surface>
  );
}
