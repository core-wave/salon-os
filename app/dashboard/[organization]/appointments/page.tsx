import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Chip,
  Description,
  Dropdown,
  Header,
  Label,
  ListBox,
  Select,
  Separator,
} from "@heroui/react";
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
        <Button>
          <Icon icon={`tabler:plus`} />
          New Appointment
        </Button>
      </DashboardPageHeader>

      <div className="flex gap-4 items-center">
        <ButtonGroup variant="secondary">
          <Button isIconOnly>
            <Icon icon={`tabler:chevron-left`} />
          </Button>
          <Button>Today</Button>
          <Button isIconOnly>
            <Icon icon={`tabler:chevron-right`} />
          </Button>
        </ButtonGroup>

        <Label className="flex-1">
          {new Intl.DateTimeFormat("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </Label>

        <Select className="w-32" defaultValue={"day"}>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="day" textValue="day">
                Day View
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="week" textValue="week">
                Week View
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="list" textValue="list">
                List View
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
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
