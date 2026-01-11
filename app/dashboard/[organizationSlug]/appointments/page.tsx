import {
  Button,
  ButtonGroup,
  Card,
  Label,
  ListBox,
  Select,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { salonCore } from "@/lib/core";
import AppointmentRow from "@/components/appointment-row";
import { notFound } from "next/navigation";

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  const org = await salonCore.getOrganizationBySlug(organizationSlug);
  if (!org) notFound();

  const availableLocations = await org.listLocations();
  if (!availableLocations) notFound();

  const location = await org.getLocation(availableLocations[0].id);
  if (!location) notFound();

  const appointments = await location.listAppointments();

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
          {appointments.map((appt, idx) => (
            <AppointmentRow {...appt} key={idx} />
          ))}
        </div>
      </Card>
    </>
  );
}
