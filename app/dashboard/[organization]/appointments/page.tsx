import { Avatar, Button, Card, Chip, Label, Separator } from "@heroui/react";
import { Fragment } from "react/jsx-runtime";
import { Icon } from "@iconify/react";
import { Appointment, mockAppointments } from "@/lib/mockdata/appointments";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";

const statusColorMap: Record<
  Appointment["status"],
  "success" | "warning" | "danger" | "default"
> = {
  Planned: "warning",
  Completed: "success",
  Cancelled: "danger",
  "No Show": "default",
};

export default async function AppointmentsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Appointments"
        description="Manage and schedule appointments"
      >
        <Button size="sm">
          <Icon icon={`tabler:plus`} />
          New Appointment
        </Button>
      </DashboardPageHeader>

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

              <div className="flex items-center gap-3">
                <Avatar>
                  <Avatar.Image
                    alt={appt.customer.fullName}
                    src={`https://tapback.co/api/avatar/${appt.customer.fullName}.webp`}
                  />
                  <Avatar.Fallback>JD</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <Label>{appt.customer.fullName}</Label>
                  <Label className="font-normal text-sm text-muted">
                    {appt.customer.email}
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
